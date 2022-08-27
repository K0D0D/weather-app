const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const ImageminPlugin = require("imagemin-webpack-plugin").default;
const imageminMozjpeg = require("imagemin-mozjpeg");
const imageminPngquant = require("imagemin-pngquant");
const Dotenv = require("dotenv-webpack");

const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

const fileName = (ext) => (isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`);

const optimization = () => {
	const configObj = {
		splitChunks: {
			chunks: "all"
		}
	};

	if (isProd) {
		configObj.minimizer = [
			new OptimizeCssAssetWebpackPlugin(),
			new TerserWebpackPlugin()
		];
	}

	return configObj;
};

module.exports = {
	target: "web",
	context: path.resolve(__dirname, "src"),
	mode: "development",
	entry: ["@babel/polyfill", "./js/main.js"],
	output: {
		clean: true,
		path: path.resolve(__dirname, "dist"),
		filename: fileName("js"),
		assetModuleFilename: "[path]/[name][ext]"
	},
	devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		compress: true,
		hot: true,
		port: 3000
	},
	devtool: isProd ? false : "source-map",
	optimization: optimization(),
	plugins: [
		new HtmlWebpackPlugin({
			template: "./index.html",
			minify: {
				collapseWhitespace: isProd
			}
		}),
		new MiniCssExtractPlugin({
			filename: fileName("css")
		}),
		new CopyPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, "src/assets"),
					to: path.resolve(__dirname, "dist/assets")
				}
			]
		}),
		new ImageminPlugin({
			disable: isDev,
			gifsicle: {
				interlaced: true
			},
			svgo: {
				removeViewBox: true
			},
			plugins: [
				imageminMozjpeg({
					quality: 85,
					progressive: true
				}),
				imageminPngquant({
					quality: [0.7, 0.8],
					speed: 1,
					strip: true
				})
			]
		}),
        new Dotenv(),
	],
	module: {
		rules: [
			{
				test: /\.html$/,
				loader: "html-loader"
			},
			{
				test: /\.(eot|ttf|otf|woff|woff2)$/,
				type: "asset/resource"
			},
			{
				test: /\.(ico|gif|png|svg|jpg|jpeg)$/,
				type: "asset/resource"
			},
			{
				test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, "css-loader"]
			},
			{
				test: /\.s[ac]ss$/,
				use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ["babel-loader"]
			}
		]
	}
};
