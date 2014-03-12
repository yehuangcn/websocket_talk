
module.exports = function encodeFrame(frame) {
	var preBytes = [];
	var payBytes = new Buffer(frame['Payload_data']);
	var dataLength = payBytes.length;

	preBytes.push((frame['FIN'] << 7) + frame['Opcode']);

	if (dataLength < 126)
		preBytes.push((frame['MASK'] << 7) + dataLength);

	else if (dataLength < Math.pow(2, 16))
		preBytes.push(
			(frame['MASK'] << 7) + 126, 
			(dataLength & 0xFF00) >> 8,
			dataLength & 0xFF
		);

	else
		preBytes.push(
			(frame['MASK'] << 7) + 127,
			(dataLength & 0xFF00000000000000) >> 56,
			(dataLength & 0xFF000000000000) >> 48,
			(dataLength & 0xFF0000000000) >> 40,
			(dataLength & 0xFF00000000) >> 32,
			(dataLength & 0xFF000000) >> 24,
			(dataLength & 0xFF0000) >> 16,
			(dataLength & 0xFF00) >> 8,
			dataLength & 0xFF
		);

	preBytes = new Buffer(preBytes);
	return Buffer.concat([preBytes, payBytes]);
};