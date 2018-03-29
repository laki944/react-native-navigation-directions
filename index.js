import { Linking, Platform } from 'react-native';
import isValidCoordinates from 'is-valid-coordinates';

const PLATFORM = Platform.OS;

export const OpenMapDirections = (frmCoord = null, toCoord, transportType) => new Promise((resolve, reject) => {
	let _toCoord;
	const _frmCoord = _checkParameters(frmCoord) !== null ? `?saddr=${_checkParameters(frmCoord)}` : '';
	if (_checkParameters(toCoord) !== null) {
		_toCoord = `&daddr=${_checkParameters(toCoord)}`
	} else {
		throw new Error('You need to pass a valid endpoint(number)')
	};
	const _transportType = _checkTransportParameter(transportType) !== null ? `&dirflg=${_checkTransportParameter(transportType)}` : '';
	const url = `${PLATFORM === 'ios' ? `http://maps.apple.com/` : 'http://maps.google.com/'}${_frmCoord}${_toCoord}${_transportType}`;
	_openApp(url).then(result => { resolve(result) });
});

const _openApp = (url) => new Promise((resolve, reject) => {
	Linking.canOpenURL(url)
		.then(res => {
			Linking.openURL(url)
				.then(result => {
					resolve('opening app....');
				}).catch(err => { reject('Cannot link app!!!'); })
		}).catch(err => {
			reject('Cannot open app!!!');
		})
});

const _checkParameters = (param) => {
	if (param === null || param === undefined || typeof param.latitude === 'string' || typeof param.longitude === 'string') { return null; }

	if (isValidCoordinates.longitude(param.longitude) && isValidCoordinates.latitude(param.latitude)) {
		return `${param.latitude},${param.longitude}`
	}

	return null;
}

const _checkTransportParameter = (param) => {
	const _transportType = param.toLowerCase();
	if (_transportType === 'd' || _transportType === 'w' || _transportType === 'r') {
		return _transportType;
	}

	return 'w';
}
