// app/components/admin/AdminPhotoUpload.tsx
// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Camera: () => <svg className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2 text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  UploadCloud: () => <svg className="w-6 h-6 md:w-8 md:h-8 mb-1 md:mb-2 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Refresh: () => <svg className="w-6 h-6 animate-spin text-[#D32F2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Check: () => <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>,
  Download: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  User: () => <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Calendar: () => <svg className="w-3 h-3 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
};

const getDriveThumbnailUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/id=([^&]+)/) || url.match(/file\/d\/([^\/]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w600`;
    }
    return url;
};

const getDriveDownloadUrl = (url: string) => {
    if (!url) return '';
    const match = url.match(/id=([^&]+)/) || url.match(/file\/d\/([^\/]+)/);
    if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
    return url;
};

export const AdminPhotoUpload = () => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);

  const currentUser = JSON.parse(localStorage.getItem('factoryOS_user') || '{}');
  const userRole = currentUser.role || 'FRONT';
  const uploaderId = currentUser.companyName || currentUser.clientId || currentUser.name || 'Staff';
  const isAdmin = userRole === 'ADMIN' || userRole === 'MANAGER';

  const masterData = JSON.parse(localStorage.getItem('factoryOS_masterData') || '{}');
  const allPhotos = masterData.staffPhotos || [];

  const displayPhotos = allPhotos.filter((p: any) => {
      if (isAdmin) return true;
      return p.uploaderId === uploaderId;
  });

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader(); reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image(); img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX = 2000; let w = img.width; let h = img.height;
          if (w > h) { if (w > MAX) { h *= MAX / w; w = MAX; } } else { if (h > MAX) { w *= MAX / h; h = MAX; } }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]); 
        };
        img.onerror = (e) => reject(e);
      };
      reader.onerror = (e) => reject(e);
    });
  };

  const handleMultiPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setIsUploadingPhoto(true);
    setUploadProgress({ current: 0, total: files.length });
    setUploadedPhotoUrls([]);

    const newUrls: string[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadProgress({ current: i + 1, total: files.length });
        try {
          const base64Data = await compressImage(files[i]);
          const payload = {
            action: 'UPLOAD_STAFF_PHOTO',
            uploaderId: uploaderId,
            fileName: `Photo_${new Date().getTime()}_${i+1}.jpg`,
            mimeType: 'image/jpeg',
            data: base64Data
          };
          
          const res = await fetch('/api/gas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
          const result = await res.json();
          
          if (result.status === 'success') {
            newUrls.push(result.url);
          } else { alert(`画像 ${i+1}枚目のアップロード失敗: ` + result.message); }

          if (i < files.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (err) { alert(`画像 ${i+1}枚目の処理エラー: ` + err); }
      }
    } finally {
      setUploadedPhotoUrls(newUrls);
      setIsUploadingPhoto(false);
      e.target.value = ''; 
      if(newUrls.length > 0) {
          alert('アップロードが完了しました！リストを更新します。');
          window.location.reload();
      }
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto pb-24 font-sans text-gray-900 min-h-full">
      <header className="mb-4 md:mb-8 border-b border-gray-200 pb-3 md:pb-6 shrink-0 mt-4 md:mt-0">
        <h2 className="text-xl md:text-2xl font-black flex items-center gap-2 md:gap-3 font-serif tracking-tight">
          <span className="w-1.5 h-5 md:h-6 bg-[#D32F2F] rounded-full"></span>
          広報・現場写真アップロード
        </h2>
        <p className="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2 font-mono tracking-widest ml-4">PHOTO UPLOAD & GALLERY</p>
      </header>

      {/* 1. アップロードエリア */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-4 md:p-12 mb-6">
        <div className="mb-6 text-center hidden md:block">
            <h3 className="text-lg font-bold text-gray-900 mb-2">現場の様子をGoogle Driveへ保存</h3>
            <p className="text-sm text-gray-500">
                撮影した写真は自動的に圧縮され、指定のクラウドフォルダに一括転送されます。<br/>
                SNSやWebサイト用の素材として活用されます。
            </p>
        </div>

        {/* ★ 変更：スマホで横並び（2カラム）になるように grid-cols-2 を指定 */}
        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-2">
          <label className={`bg-red-50 hover:bg-red-100 border border-red-200 text-[#D32F2F] py-6 md:py-12 rounded-sm shadow-sm font-bold flex flex-col items-center justify-center gap-1 md:gap-2 transition cursor-pointer ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
            <Icons.Camera />
            <span className="text-[11px] md:text-base tracking-widest text-center">カメラで撮影</span>
            <span className="text-[8px] md:text-xs font-normal opacity-80 hidden md:block">その場で撮影してアップロード</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleMultiPhotoUpload} className="hidden" disabled={isUploadingPhoto} />
          </label>
          
          <label className={`bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-900 py-6 md:py-12 rounded-sm shadow-sm font-bold flex flex-col items-center justify-center gap-1 md:gap-2 transition cursor-pointer ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
            <Icons.UploadCloud />
            <span className="text-[11px] md:text-base tracking-widest text-center">フォルダから</span>
            <span className="text-[8px] md:text-xs font-normal opacity-80 hidden md:block">複数枚の一括アップロードに対応</span>
            <input type="file" accept="image/*" multiple onChange={handleMultiPhotoUpload} className="hidden" disabled={isUploadingPhoto} />
          </label>
        </div>

        {isUploadingPhoto && (
          <div className="text-center p-4 md:p-8 bg-gray-50 border border-gray-200 rounded-sm shadow-inner animate-in fade-in mt-4">
            <div className="flex justify-center mb-2 md:mb-4"><Icons.Refresh /></div>
            <p className="text-sm md:text-base font-bold text-gray-700 mb-1 md:mb-2">自動圧縮＆送信中...</p>
            <p className="text-xs md:text-sm text-gray-500 font-mono mb-3 md:mb-4">{uploadProgress.current} / {uploadProgress.total} 枚完了</p>
            <div className="w-full max-w-md mx-auto bg-gray-200 h-2 md:h-3 rounded-full overflow-hidden">
              <div className="bg-[#D32F2F] h-full transition-all duration-300" style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}></div>
            </div>
          </div>
        )}
      </div>

      {/* 2. 登録画像ギャラリー */}
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-4 md:p-8">
          <div className="flex justify-between items-center mb-4 md:mb-6 pb-2 border-b border-gray-200">
              <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm md:text-base">
                  📸 ギャラリー 
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] md:text-xs font-mono">{displayPhotos.length}枚</span>
              </h3>
              {isAdmin && <span className="bg-[#D32F2F] text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-sm shadow-sm tracking-widest">管理者モード</span>}
          </div>

          {displayPhotos.length === 0 ? (
              <div className="text-center py-10 md:py-16 text-gray-400 font-bold text-xs md:text-sm bg-gray-50 rounded-sm border border-dashed border-gray-300">
                  まだアップロードされた写真がありません。
              </div>
          ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-4">
                  {displayPhotos.slice(0, 50).map((photo: any, idx: number) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm hover:shadow-md hover:border-gray-400 transition-all group flex flex-col">
                          <div className="relative aspect-square bg-gray-100 overflow-hidden cursor-zoom-in">
                              <a href={photo.url} target="_blank" rel="noopener noreferrer">
                                  <img 
                                      src={getDriveThumbnailUrl(photo.url)} 
                                      alt="現場写真" 
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                      loading="lazy"
                                  />
                              </a>
                          </div>
                          <div className="p-1.5 md:p-2 flex flex-col gap-1 text-[9px] md:text-[10px] text-gray-500 bg-gray-50 flex-1">
                              <div className="flex items-center justify-between">
                                  <span className="font-mono flex items-center"><Icons.Calendar /> {photo.date ? String(photo.date).substring(5,10).replace('-','/') : ''}</span>
                                  <a 
                                      href={getDriveDownloadUrl(photo.url)} 
                                      className="bg-gray-900 text-white p-1 rounded-sm hover:bg-[#D32F2F] transition-colors"
                                      title="元画像をダウンロード"
                                  >
                                      <Icons.Download />
                                  </a>
                              </div>
                              {isAdmin && (
                                  <span className="truncate font-bold text-gray-700 flex items-center mt-0.5">
                                      <Icons.User /> {photo.uploaderId}
                                  </span>
                              )}
                          </div>
                      </div>
                  ))}
              </div>
          )}
          {displayPhotos.length > 50 && (
              <div className="text-center mt-4 md:mt-6 text-[10px] md:text-xs text-gray-500 font-bold">
                  ※システム負荷軽減のため、最新の50件のみ表示しています。
              </div>
          )}
      </div>

    </div>
  );
};
