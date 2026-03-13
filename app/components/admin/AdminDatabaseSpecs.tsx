// app/components/admin/AdminDatabaseSpecs.tsx
import React, { useState, useEffect } from 'react';

const Icons = {
  Search: () => <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Book: () => <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
};

export const AdminDatabaseSpecs = () => {
  const [specs, setSpecs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // コンポーネントがマウントされたら、JSONを読み込む
  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        // public/specs/yazaki.json をフェッチ
        const res = await fetch('/specs/yazaki.json');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setSpecs(data);
      } catch (error) {
        console.error('Error loading specs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpecs();
  }, []);

  // 検索フィルター
  const filteredSpecs = specs.filter(spec => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const target = `${spec.maker} ${spec.name} ${spec.size} ${spec.core}`.toLowerCase();
    return target.includes(term);
  });

  return (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-500">
      {/* 検索ヘッダー */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4 items-center">
        <div className="flex items-center gap-2 font-black text-gray-800">
          <Icons.Book /> メーカーカタログ辞書
        </div>
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icons.Search />
          </div>
          <input
            type="text"
            placeholder="品名、サイズ、芯数で検索 (例: VVF 2 3)..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:border-gray-900 outline-none shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-xs text-gray-500 font-bold ml-auto">
          総収録数: {specs.length} 件
        </div>
      </div>

      {/* データ一覧テーブル */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-gray-400 font-bold">
            カタログデータを読み込み中...
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase tracking-wider text-xs sticky top-0 shadow-sm border-b border-gray-300">
              <tr>
                <th className="p-3 font-bold">メーカー</th>
                <th className="p-3 font-bold">品名</th>
                <th className="p-3 font-bold">SQ / 芯数</th>
                <th className="p-3 font-bold">導体構成</th>
                <th className="p-3 font-bold">被覆厚み (絶縁/シース)</th>
                <th className="p-3 font-bold text-right">外径(mm) / 質量(kg/km)</th>
                <th className="p-3 font-bold text-right text-blue-700">理論歩留</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSpecs.map((spec, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 text-xs text-gray-500 font-bold">{spec.maker}</td>
                  <td className="p-3 font-black text-gray-900">{spec.name}</td>
                  <td className="p-3 font-mono font-bold text-gray-700">
                    {spec.size !== '-' ? `${spec.size}sq` : '-'} / {spec.core !== '-' ? `${spec.core}C` : '-'}
                  </td>
                  <td className="p-3 text-xs text-gray-600">
                    <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200 font-bold">
                      {spec.conductor}
                    </span>
                    {(spec.conductorStrands !== '-' || spec.conductorStrandDia !== '-') && (
                      <span className="ml-2 font-mono text-gray-500">
                        ({spec.conductorStrands}本 / {spec.conductorStrandDia}mm)
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-xs font-mono text-gray-500">
                    {spec.insulatorThickness} / {spec.sheathThickness}
                  </td>
                  <td className="p-3 text-right font-mono text-xs text-gray-600">
                    {spec.outerDiameter} / {spec.weightPerKm}
                  </td>
                  <td className="p-3 text-right font-mono font-black text-blue-700 text-lg">
                    {spec.theoreticalRatio ? `${spec.theoreticalRatio}%` : '-'}
                  </td>
                </tr>
              ))}
              {filteredSpecs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-gray-400 font-bold">
                    一致するカタログデータが見つかりません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
