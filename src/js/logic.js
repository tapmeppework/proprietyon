{
	const
		abcd = {
			umbrella: 'tapmeppe',
		},
		html = document.documentElement

	/**
	 * @description Set the layout theme.
	 * @see https://dev.to/abbeyperini/dark-mode-toggle-and-prefers-color-scheme-4f3m
	 */
	for (const theme of ['dark', 'light']) {
		if (window.matchMedia(`(prefers-color-scheme: ${theme})`).matches) {
			html.setAttribute('data-bs-theme', theme)
			// html.setAttribute(`data-${abcd.umbrella}-theme`, theme)
			break
		}
	}

	/**
		 * @description The JS representation of the root element.
		 * 							document.documentElement =: document.querySelector('html')
		 * @readonly
		 */
	const footer = html.querySelector('body > footer')
	if (footer) {
		/**
		 * @description This method is used to make sure the footer is always at the bottom of the page.
		 * @see https://stackoverflow.com/questions/2146874/detect-if-a-page-has-a-vertical-scrollbar
		 * 			window.innerHeight > document.documentElement.clientHeight -> works well on desktop only
		 */
		const
			date = footer.querySelector('#footer-date'),
			classList = footer.classList,
			moveFooter = () => {
				const
					[remove, add] = html.scrollHeight > html.clientHeight ? //TRUE if scrollbar
						['fixed-bottom', 'sticky-md-bottom'] :
						['sticky-md-bottom', 'fixed-bottom']
				classList.replace(remove, add)
				classList.remove('visually-hidden')
			}

		if (date) {
			date.innerHTML = new Date().getFullYear()
			date.classList.remove('placeholder')
		}
		moveFooter()
		window.addEventListener('resize', moveFooter) //window observer
		new ResizeObserver(moveFooter).observe(html) //DOM observer
	}

	// handle the location
	if (window.location.hash) {
		// activate the bootstrap related element
		const element = html.querySelector(`[data-bs-target='${window.location.hash}']`)
		if (element) element.click()
		else {
			// handle the element
			const element = html.querySelector(window.location.hash)
			if (element) {
				// TODO scroll to element
			}
		}
	}

	/**
	 * @see https://stackoverflow.com/questions/49820013/javascript-scrollintoview-smooth-scroll-and-offset
	 */
	// const scrollIntoView = element => {
	// 	// element.scrollIntoView({ behavior: 'auto', block: 'start' })
	// 	window.scrollTo({
	// 		top: element.getBoundingClientRect().top + window.scrollY - wonder.offset,
	// 		behavior: "smooth"
	// 	})
	// }

	// scroller event listener
	const scroller = document.getElementById('scroller-to-top')
	if (scroller) {
		const onScroll = () => {
			if (html.scrollTop < 100) scroller.classList.add('d-none')
			else scroller.classList.remove('d-none')
		}
		onScroll()
		document.addEventListener('scrollend', onScroll)
		scroller.addEventListener(
			'click',
			() => window.scrollTo({ top: 0, behavior: 'smooth' }) //scroll to top
		)
	}

	/**
	 * map
	 * @see https://leafletjs.com/
	 * @see https://leafletjs.com/examples/quick-start/
	 * @see https://leafletjs.com/reference.html#divicon
	 * @see https://leafletjs.com/examples/extending/extending-3-controls.html custom button
	 * @see https://nominatim.org/release-docs/develop/api/Search/
	 * @example https://nominatim.openstreetmap.org/search?q="69250 Schönau, Germany"&format=json&limit=1
	 */
	const container = document.getElementById('map')
	if (container) {
		const
			prefix = `${abcd.umbrella}-map-`,
			location = [49.4366884, 8.8090874], //[latitude, longitude]
			map = L.map(container.firstElementChild).setView(location, 13),
			icon = container.children.item(1).innerHTML.trim(),
			message = container.lastElementChild.innerHTML.trim()

		L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '<a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
		}).addTo(map)
		const marker = L.marker(location, {
			icon: L.divIcon({
				className: `${prefix}marker`,
				html: icon,
			})
		}).addTo(map)
		marker.bindPopup(
			message,
			{
				offset: L.point(-1, -5),
				className: `${prefix}popup`,
			}
		).openPopup()

		// custom button
		const button = L.Control.extend({
			onAdd: () => {
				const button = L.DomUtil.create('button')
				button.innerHTML = icon
				button.setAttribute('class', `${abcd.umbrella}-aspect-ratio btn btn-primary d-flex justify-content-center align-items-center rounded-circle`)
				button.addEventListener('click', () => map.flyTo(location, 15))

				return button;
			},
			onRemove: () => { },
		})
		new button({ position: `topright` }).addTo(map)
	}

	/**
	 * bootstrap tooltip
	 * @see https://getbootstrap.com/docs/5.3/components/tooltips
	 */
	document.querySelectorAll('[data-bs-toggle=tooltip],[title]')
		.forEach(element => new bootstrap.Tooltip(element, { html: true }))
	
	/**
	 * @description Event handler used once the page has fully loaded on the client side.
	 */
	// window.addEventListener("load", (event) => {})
}