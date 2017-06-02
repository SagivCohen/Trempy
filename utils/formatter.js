class Formatter {

	constructor() {}

	formatToJavaDate(jsDate)
	{
		//dd/mm/yyyy
		var javaDate = jsDate.getDate() + "/" + (jsDate.getMonth()+1) + "/" + jsDate.getFullYear();
		//add hh:mm:ss
		javaDate = javaDate + " " + jsDate.getHours()+":"+jsDate.getMinutes()+":"+jsDate.getSeconds();

		return javaDate;
	}
}

module.exports = new Formatter;