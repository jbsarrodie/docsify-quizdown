// docsify-quizdown.js (based on docsify-markmap.js)
(function () {
  var myPlugin = function (hook, vm) {
  	const config = window.$docsify.quizdown;
  	
  	var regex = {
        quizWrapperStart: /[\r\n]\s*<!-+\s+quizdown:\s*?start\s+-+>/g,  // <!-- quizdown:start -->
        quizWrapperEnd: /[\r\n]\s*<!-+\s+quizdown:\s*?end\s+-+>/g       // <!-- quizdown:end -->
    };
    
    // Invoked on each page load before new markdown is transformed to HTML.
    hook.beforeEach(function (markdown) {
    	// Convert HTML comments 'quizdown:start' and 'quizdown:end' to code block delimiters
      markdown = markdown.replaceAll(regex.quizWrapperStart, "\n````quizdown");
      markdown = markdown.replaceAll(regex.quizWrapperEnd, "\n````");
      return markdown;
    });
  	
  	// Invoked on each page load after new HTML has been appended to the DOM
    hook.doneEach(function () {
    	const codeBlocks = document.querySelectorAll("pre[data-lang='quizdown']");
    	codeBlocks.forEach((codeBlock) => {
    		// Replace code block by a div
      	const code = codeBlock.textContent.trim();
      	const container = document.createElement("div");
      	container.className = "quizdown";
      	codeBlock.parentNode.replaceChild(container, codeBlock);
      	// Attach Quiz to the newly created div
      	window.quizdown.createApp(code, container, config);
      	// Inject some css into the shadow DOM to force full width
      	with (container.shadowRoot.querySelector(".quizdown-content").style) {
      		maxWidth = "none";
      		padding = "0";
      		margin = "2em 0";
      	}
      	const style = document.createElement('style');
      	style.innerHTML = "pre > code { display: block; }";
      	container.shadowRoot.appendChild(style);
    	});
    });
  }

	// Add plugin to docsify's plugin array
  $docsify = $docsify || {};
  $docsify.plugins = [].concat(myPlugin, $docsify.plugins);
})();
