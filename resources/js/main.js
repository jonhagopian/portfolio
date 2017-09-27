function navSetup() {
	var headerNav = document.getElementById("navigation");
	headerNav.addEventListener("click", function() {
		if (headerNav.className === "open") {
			headerNav.className = "close";
		} else {
			headerNav.className = "open";
		}
	});
}
window.addEventListener("load", function() {
	navSetup();
});
