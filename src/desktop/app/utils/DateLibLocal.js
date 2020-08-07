export default function DateLib(date, format = "-") {
	if (typeof format != 'string') throw new Error("format should be an string, you can through like '-'");
	date = date || new Date();

	switch (typeof date) {
		case 'object':
			this._year = (date.getFullYear()).toString();
			this._month = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1).toString();
			this._day = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()).toString();
			this._hours = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()).toString();
			this._minutes = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()).toString();
			this._seconds = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()).toString();
			this._format = format;
			break;
		case 'string':
			let year = date.match(/^\d{2,4}(?=[-/\\])/),
				month = date.match(/\d+(?=[-/\\]\d+$)/),
				day = date.match(/\d+$/);
			if (date.length > 10 || date.length < 8 || !year || !month || !day) {
				throw new Error("String does not conform to the specification, you can through a new string like 'yyyy-mm-dd'");
			}
			this._year = year.toString();
			this._month = (parseInt(month) < 10 ? '0' + parseInt(month) : month).toString();
			this._day = (parseInt(day) < 10 ? '0' + parseInt(day) : day).toString();
			this._format = format;
			break;
		default:
			throw new Error("date should be an object || string, you can through a new Date() || 'yyyy-mm-dd'");
	}
}

DateLib.prototype = {
	getYear() {
		return this._year;
	},
	getMonth() {
		return this._month;
	},
	getDay() {
		return this._day;
	},
	getFullDate() {
		if (this._hours && this._minutes && this._seconds)
		return [this._year, this._month, this._day].join(this._format) + ' ' + [this._hours, this._minutes, this._seconds].join(':');
	},
	toString() {
		return this.valueOf();
	},
	valueOf() {
		return [this._year, this._month, this._day].join(this._format);
	},
	getFullDatetoString() {
		if (this._hours && this._minutes && this._seconds)
		return `${this._month}${this._day}${this._hours}`;
	},
}
