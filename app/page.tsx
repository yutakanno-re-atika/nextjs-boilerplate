// =========================================================
// WIRE MASTER CLOUD - BACKEND (GAS)
// Version: 2.0 (Hybrid: Wire & Casting)
// =========================================================

// 1. GETリクエスト処理 (データ取得)
function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const result = {
    status: 'success',
    config: {},
    history: [],
    wires: [],    // 旧 products (電線)
    castings: [], // 新規追加 (鋳造)
    reservations: [], // 管理画面用
    stats: {}
  };

  try {
    result.config = getConfig(ss);
    result.history = getMarketHistory(ss);
    result.wires = getProductsWire(ss);
    result.castings = getProductsCasting(ss);
    // 管理者用: 本日の予約を取得
    result.reservations = getReservations(ss);

  } catch (error) {
    return createJSONOutput({ status: 'error', message: error.toString() });
  }

  return createJSONOutput(result);
}

// 2. POSTリクエスト処理 (ログイン、登録など)
function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    const params = JSON.parse(e.postData.contents);
    const action = params.action;

    // --- A. ログイン認証 ---
    if (action === 'AUTH_LOGIN') {
      const user = authenticateUser(ss, params.loginId, params.password);
      if (user) {
        return createJSONOutput({ status: 'success', user: user });
      } else {
        return createJSONOutput({ status: 'error', message: 'IDまたはパスワードが違います' });
      }
    }

    // --- B. 取引登録 (POSレジ) ---
    if (action === 'REGISTER_TRANSACTION') {
      const txId = registerTransaction(ss, params);
      return createJSONOutput({ status: 'success', data: { transactionId: txId } });
    }

    // --- C. 予約登録 ---
    if (action === 'REGISTER_RESERVATION') {
      const resId = registerReservation(ss, params);
      return createJSONOutput({ status: 'success', data: { reservationId: resId } });
    }

    return createJSONOutput({ status: 'error', message: 'Invalid Action' });

  } catch (error) {
    return createJSONOutput({ status: 'error', message: error.toString() });
  }
}

// =========================================================
// 内部関数 (ロジック)
// =========================================================

// JSONレスポンス生成ヘルパー
function createJSONOutput(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// コンフィグ取得
function getConfig(ss) {
  const sheet = ss.getSheetByName('Config');
  if (!sheet) return { market_price: 1450 }; // デフォルト値
  const data = sheet.getDataRange().getValues();
  const config = {};
  data.forEach(row => { config[row[0]] = row[1]; });
  return config;
}

// 相場履歴取得
function getMarketHistory(ss) {
  // 簡易的にConfigの値を現在値として返す（本来はHistoryシートから取得）
  const sheet = ss.getSheetByName('Config');
  const price = sheet ? sheet.getRange("B1").getValue() : 1450; 
  // ダミーの履歴データを生成（本来は蓄積データを使う）
  return [
    { date: '2025/02/01', value: price - 50 },
    { date: '2025/02/05', value: price - 20 },
    { date: '2025/02/10', value: price + 10 },
    { date: 'NOW', value: price }
  ];
}

// 電線マスタ取得
function getProductsWire(ss) {
  const sheet = ss.getSheetByName('Products_Wire'); // シート名注意
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  data.shift(); // ヘッダー削除
  return data.map(row => ({
    id: row[0], maker: row[1], name: row[2], sq: row[3], core: row[4], ratio: row[5], category: row[6]
  })).filter(p => p.id);
}

// 鋳造マスタ取得
function getProductsCasting(ss) {
  const sheet = ss.getSheetByName('Products_Casting'); // シート名注意
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  data.shift();
  return data.map(row => ({
    id: row[0], name: row[1], type: row[2], form: row[3], ratio: row[4], price_offset: row[5], description: row[6]
  })).filter(p => p.id);
}

// 予約取得 (Admin用)
function getReservations(ss) {
  const sheet = ss.getSheetByName('Reservations');
  if (!sheet) return [];
  const data = sheet.getDataRange().getValues();
  data.shift();
  // 直近のものだけ返すなどのフィルタリングが可能
  return data.map(row => ({
    id: row[0], date: row[1], memberId: row[2], memberName: row[3], items: row[4], total: row[5]
  })).reverse().slice(0, 10);
}

// ユーザー認証
function authenticateUser(ss, loginId, password) {
  const sheet = ss.getSheetByName('Clients');
  if (!sheet) return null;
  const data = sheet.getDataRange().getValues();
  data.shift();
  
  // カラム想定: A:ID, B:Pass, C:Name, D:Rank, E:Role
  const userRow = data.find(row => row[0] == loginId && row[1] == password);
  
  if (userRow) {
    return {
      id: userRow[0],
      name: userRow[2],
      rank: userRow[3],
      role: userRow[4] // 'ADMIN' or 'MEMBER'
    };
  }
  return null;
}

// 取引登録
function registerTransaction(ss, params) {
  let sheet = ss.getSheetByName('Transactions');
  if (!sheet) {
    sheet = ss.insertSheet('Transactions');
    sheet.appendRow(['ID', 'Date', 'MemberID', 'Product', 'Weight', 'Rank', 'Price', 'Status']);
  }
  
  const txId = 'TX-' + new Date().getTime();
  const date = new Date().toLocaleString('ja-JP');
  
  sheet.appendRow([
    txId, date, params.memberId, params.productName, 
    params.weight, params.rank, params.price, 'COMPLETED'
  ]);
  
  return txId;
}

// 予約登録
function registerReservation(ss, params) {
  let sheet = ss.getSheetByName('Reservations');
  if (!sheet) {
    sheet = ss.insertSheet('Reservations');
    sheet.appendRow(['ID', 'VisitDate', 'MemberID', 'Name', 'ItemsJSON', 'TotalEstimate']);
  }
  
  const resId = 'RES-' + new Date().getTime();
  const itemsJson = JSON.stringify(params.items);
  
  sheet.appendRow([
    resId, params.visitDate, params.memberId, params.memberName, 
    itemsJson, params.totalEstimate
  ]);
  
  return resId;
}
