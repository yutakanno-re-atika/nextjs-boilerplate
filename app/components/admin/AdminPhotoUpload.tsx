// app/components/admin/AdminPhotoUpload.tsx
// @ts-nocheck
import React, { useState } from 'react';

const Icons = {
  Camera: () => <svg className="w-8 h-8 mb-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  UploadCloud: () => <svg className="w-8 h-8 mb-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  Refresh: () => <svg className="w-6 h-6 animate-spin text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
  Check: () => <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
};

export const AdminPhotoUpload = () => {
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [uploadedPhotoUrls, setUploadedPhotoUrls] = useState<string[]>([]);

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
    
    let uploaderId = 'Staff';
    try {
      const userStr = localStorage.getItem('factoryOS_user');
      if (userStr) {
        const user = JSON.parse(userStr);
        uploaderId = user.companyName || user.clientId || 'Staff';
      }
    } catch(err) {}

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
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500 w-full max-w-4xl mx-auto pb-24 font-sans text-gray-900">
      <header className="mb-8 border-b border-gray-200 pb-6">
        <h2 className="text-2xl font-black flex items-center gap-3 font-serif tracking-tight">
          <span className="w-1.5 h-6 bg-[#D32F2F] rounded-full"></span>
          広報・現場写真アップロード
        </h2>
        <p className="text-sm text-gray-500 mt-2 font-mono tracking-widest ml-4">PHOTO UPLOAD TASK</p>
      </header>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm p-8 md:p-12 relative overflow-hidden">
        <div className="mb-8 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">現場の様子をGoogle Driveへ保存</h3>
            <p className="text-sm text-gray-500">
                撮影した写真は自動的に圧縮され、指定のクラウドフォルダに一括転送されます。<br className="hidden md:block"/>
                SNSやWebサイト用の素材として活用されます。
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <label className={`flex-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 py-12 rounded-lg shadow-sm font-bold flex flex-col items-center justify-center gap-2 transition cursor-pointer ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
            <Icons.Camera />
            <span className="text-base tracking-widest">カメラを起動</span>
            <span className="text-xs font-normal opacity-80">その場で撮影してアップロード</span>
            <input type="file" accept="image/*" capture="environment" onChange={handleMultiPhotoUpload} className="hidden" disabled={isUploadingPhoto} />
          </label>
          
          <label className={`flex-1 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-12 rounded-lg shadow-sm font-bold flex flex-col items-center justify-center gap-2 transition cursor-pointer ${isUploadingPhoto ? 'opacity-50 pointer-events-none' : ''}`}>
            <Icons.UploadCloud />
            <span className="text-base tracking-widest">フォルダから選択</span>
            <span className="text-xs font-normal opacity-80">複数枚の一括アップロードに対応</span>
            <input type="file" accept="image/*" multiple onChange={handleMultiPhotoUpload} className="hidden" disabled={isUploadingPhoto} />
          </label>
        </div>

        {isUploadingPhoto && (
          <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg shadow-inner">
            <div className="flex justify-center mb-4"><Icons.Refresh /></div>
            <p className="text-base font-bold text-gray-700 mb-2">自動圧縮＆送信中...</p>
            <p className="text-sm text-gray-500 font-mono mb-4">{uploadProgress.current} / {uploadProgress.total} 枚完了</p>
            <div className="w-full max-w-md mx-auto bg-gray-200 h-3 rounded-full overflow-hidden">
              <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}></div>
            </div>
          </div>
        )}

        {!isUploadingPhoto && uploadedPhotoUrls.length > 0 && (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-center gap-2 mb-4 text-green-700">
              <Icons.Check />
              <span className="font-bold text-lg">{uploadedPhotoUrls.length}枚の転送が完了しました！</span>
            </div>
            <div className="bg-white rounded-md p-4 max-h-48 overflow-y-auto border border-green-100">
                <ul className="text-sm text-blue-600 space-y-2 font-mono">
                {uploadedPhotoUrls.map((url, idx) => (
                    <li key={idx} className="truncate hover:bg-gray-50 p-1 rounded transition">
                        <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                            <span>🔗</span> 画像 {idx+1} を確認
                        </a>
                    </li>
                ))}
                </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
