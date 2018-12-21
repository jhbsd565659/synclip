const request = require('request');
const fs = require('fs');
const path = require('path');
const https = require('https');
const execSync = require('child_process').execSync;

if(process.argv.length < 2) {
	console.log('synclip clipboard sync tool');
	console.log('version 0.1.0');
	console.log('');
	console.log('usage:');
	console.log('synclip [-c [https://target.ip], -s [port(default:3000)]]');
	process.exit(1);
}

if(process.argv[2] == '-c') {
	const certFile = path.resolve(__dirname, 'ssl/client.crt');
	const keyFile = path.resolve(__dirname, 'ssl/client.key');

	const headers = {
		'Content-Type':'application/json'
	};

	let cmd = '';
	let cmd2 = '';
	if(process.platform === 'win32') {
		cmd = 'powershell .\cimg.ps1';
		cmd2 = 'powershell -Command Get-ClipBoard -Format Text';
	}
	else {
		cmd = './cimg.sh';
		if(process.platform === 'linux') {
			cmd2 = 'xclip -o -sel p';
		}
		else if((process.platform === 'darwin') {
			cmd2 = 'pbpaste';
		}
	}

	const img = execSync(cmd);
	const text = execSync(cmd2);

	const options = {
		url: process.argv[3],
		method: 'POST',
		headers: headers,
		json: true,
		form: {
			"text":text,
			"img":img
		},
		agentOptions: {
			cert: fs.readFileSync(certFile),
			key: fs.readFileSync(keyFile),
			passphrase: process.env.PASS_PHRASE,
			securityOptions: 'SSL_OP_NO_SSLv3'
		}
	};

	request(options, (err, res, body) => {
		if(err == null && res.statusCode == 200) {
			console.log("send:OK");
			process.exit(0);
		} else {
			console.log("send:NG");
			process.exit(1);
		}
	});
}
else if(process.argv[2] == '-s') {
	const certFile = path.resolve(__dirname, 'ssl/server.crt');
	const keyFile = path.resolve(__dirname, 'ssl/server.key');
	const caFile = path.resolve(__dirname, 'ssl/server-ca.pem');

	const options = { 
		key: fs.readFileSync(keyFile),
		cert: fs.readFileSync(certFile),
		ca: fs.readFileSync(caFile),
	}; 

	https.createServer(options, (req, res) => {
		res.writeHead(200);
		res.end();
		process.exit(0);
	}).listen(process.argv[3] || 3000);
}



