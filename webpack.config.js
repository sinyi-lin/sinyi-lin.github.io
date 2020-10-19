const path = require('path'); 
// CSS檔案獨立產出
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); 
// PUG轉出HTML
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = { 
    // == 進入點，檔案必須與此檔案有關聯才會被編譯 ====
    entry: './src/js/index.js',

    output: {
        // 編譯檔案名稱
        filename: 'main.bundle.js',
        // 編譯檔案的位置，這裡使用path模組的resolve()取得絕對位置，"__dirname"代表本文件的目錄位置
        path: path.resolve(__dirname, 'dist'),
    },
    
    //== devserver的設定 ====
    devServer: { 
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        //是否啟用 HMR
        hot: false,
        //指定開啟port為9000(如未設定，則預設為8080)
        port: 8080 
    },

    module: { 
      rules: [ 

        // 打包圖片資源
        // {
        //   test:/\.(jpg|png|gif|bmp|jpeg|svg)$/,
        //   use: [
        //     {
        //       loader: 'url-loader?limit=8192&name=img/[hash:8].[name].[ext]',
        //     }
        //   ]
        // },

        // -- sass轉css，main.css ----
        { 
          test: /\.s[ac]ss$/i, 
          use: [ 
            MiniCssExtractPlugin.loader, 
            'css-loader',
            'sass-loader' 
          ] 
        },
        
        // -- pug轉html ----
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'raw-loader',
              options: '',
            },
            {
              loader: 'pug-html-loader',
              options: {
                  // 美化 HTML 的編排 (不壓縮HTML的一種)
                  pretty: true 
                  
              }
            },
          ]
        },
      ] 
    },

    plugins: [
        // -- 獨立產出CSS檔案 ----
        new MiniCssExtractPlugin({
          filename: './assets/cms/css/[name].css',
          chunkFilename: '[id].css',
          ignoreOrder: false
        }),
        
        // -- pug產出HTML檔案 ----
        new HtmlWebpackPlugin({
          template: path.join(__dirname, 'src/pug/pages/index.pug'),
          filename:'./index.html',
          // 'body',javascript 資源將被放置到body元素的底部
          inject: true, 
          // 指定需要引入的js，沒有設置默認全部引入
          chunks: ['main'], 
          // 排除的js
          excludeChunks: ['devor.js'], 
          minify: {
            sortAttributes: true,
            // 折疊空白字元就是壓縮Html
            collapseWhitespace: false, 
            // 折疊布林值属性，例:readonly checked
            collapseBooleanAttributes: true, 
            // 移除註釋
            removeComments: true,
            // 移除屬性的引號
            removeAttributeQuotes: true 
            
          }
        })
      ], 
};