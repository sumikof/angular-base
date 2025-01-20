const http = require('http');
const fs = require('fs');
const path = require('path');

// サーバーポート
const PORT = process.env.PORT || 3000;
// Angular の静的ファイルフォルダ
const DIST_DIR = path.join(__dirname, 'dist/<プロジェクト名>');

// MIME タイプのマッピング
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

// HTTP サーバーを作成
const server = http.createServer((req, res) => {
  let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url);

  // 拡張子のない URL に対処
  if (!path.extname(filePath)) {
    filePath += '.html';
  }

  // ファイルの読み込み
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // ファイルが見つからない場合
      if (err.code === 'ENOENT') {
        // 404 ページにフォールバック
        fs.readFile(path.join(DIST_DIR, 'index.html'), (fallbackErr, fallbackData) => {
          if (fallbackErr) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(fallbackData);
          }
        });
      } else {
        // その他のエラー
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else {
      // MIME タイプを設定してファイルを返す
      const ext = path.extname(filePath).toLowerCase();
      const mimeType = mimeTypes[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(data);
    }
  });
});

// サーバーを起動
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
