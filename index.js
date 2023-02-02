const express = require('express');
const cors = require('cors');
const os = require('os');
const cluster = require('cluster');
const { PORT } = require('./config');
const { header1, header2, header3, header4 } = require('./controller');

const server = () => {
	const app = express();
	app.use(cors());
	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());

	app.post('/activation', (req, res) => {
		try {
			const { code, url, email } = req.body;
			if (code && url) {
				return res.status(200).json({
					status: 'activated',
					protected_functions: { header1: header1, header2: header2, header3: header3, header4: header4 },
				});
			} else {
				throw Error('code and url');
			}
		} catch (e) {
			return res.status(400).json({});
		}
	});

	app.listen(PORT, () => {
		console.log(`The server is running: ${PORT} stream ${process.pid}`);
	});
};

const clusterWorkerSize = os.cpus().length;
if (clusterWorkerSize > 1) {
	if (cluster.isMaster) {
		for (let i = 0; i < clusterWorkerSize - 1; i++) {
			cluster.fork();
		}
		cluster.on('exit', (worker) => {
			console.log('Worker', worker.id, ' has exitted.');
			cluster.fork();
		});
	} else {
		server();
	}
} else {
	server();
}
