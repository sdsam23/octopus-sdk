export const selenium = {
	methods: {
		seleniumFormat(string){
			return string.toLowerCase().replace(/\s/g, "");
		},
	}
}
export const cookies = {
	methods: {
		setCookie(name, value) {
			var date = new Date();
			date.setTime(date.getTime() + (24*60*60*1000));
			var expires = "; expires=" + date.toUTCString();
			document.cookie = name + "=" + (value || "")  + expires + "; path=/";
		},
		getCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (0 === c.indexOf(nameEQ)) return c.substring(nameEQ.length,c.length);
			}
			return null;
		}
	}
}

export const displayMethods = {
	methods: {
		urlify(text) {
			let urlRegex = /(https?:\/\/[^\s]+)/g;
			if(!text)
			return '';
			return text.replace(urlRegex, (url) =>{
				return '<a href="' + url + '" target="_blank">' + url + '</a>';
			});
		},
	}
}