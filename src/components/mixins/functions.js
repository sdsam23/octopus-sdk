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
		async onCopyCode(link,isSnackbar= true, isLink=false) {
			if ('undefined' !== typeof(navigator.clipboard)) {
				await navigator.clipboard.writeText(link);
				if(!isSnackbar){
					return;
				}
				if(isLink){
					this.$refs.snackbar.open(this.$t('Link in clipboard'));
				}else{
					this.$refs.snackbar.open(this.$t('Data in clipboard'));
				}
				return;
			}
			let textArea = document.createElement("textarea");
			textArea.value = link;
			textArea.style.position="fixed";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			var successful = document.execCommand('copy');
			if(successful && isSnackbar){
				if(isLink){
					this.$refs.snackbar.open(this.$t('Link in clipboard'));
				}else{
					this.$refs.snackbar.open(this.$t('Data in clipboard'));
				}
			}
			document.body.removeChild(textArea);            
		},
	}
}