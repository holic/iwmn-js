var request = require('superagent')

module.exports = IWMN


function IWMN (token) {
	this.TOKEN = token

	this.domains = Domains(this)
	this.transfers = Transfers(this)
	this.apps = Apps(this)
	this.account = Account(this)
	this.products = Products(this)
	this.tlds = TLDs(this)
	this.searchResults = SearchResults(this)
}

IWMN.prototype.URL = 'https://api.iwantmyname.com'

IWMN.prototype.path = function () {
	return ''
}
IWMN.prototype.url = function () {
	return this.URL
}
IWMN.prototype.token = function () {
	return this.TOKEN
}

function Section (parent, path, init) {
	this.PARENT = parent
	this.PATH = path

	// Define these here because `Section.call` doesn't inherit the prototype
	this.path = this.path || Section.prototype.path
	this.url = this.url || Section.prototype.url
	this.token = this.token || Section.prototype.token

	init && init.call(this)
}

Section.prototype.path = function () {
	return this.PARENT.path() + this.PATH
}
Section.prototype.url = function () {
	return this.PARENT.url() + this.PATH
}
Section.prototype.token = function () {
	return this.PARENT.token()
}


function getJSON (done) {
	return request
		.get(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'application/json')
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}
function postJSON (data, done) {
	return request
		.post(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'application/json')
		.set('Content-Type', 'application/json')
		.send(data)
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}
function patchJSON (data, done) {
	return request
		.patch(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'application/json')
		.set('Content-Type', 'application/json')
		.send(data)
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}
function putJSON (data, done) {
	return request
		.put(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'application/json')
		.set('Content-Type', 'application/json')
		.send(data)
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}
function deleteJSON (done) {
	return request
		.del(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'application/json')
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}


function getText (done) {
	return request
		.get(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'text/plain')
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}
function putText (data, done) {
	return request
		.put(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'text/plain')
		.set('Content-Type', 'text/plain')
		.send(data)
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}


function Nameservers (parent) {
	return new Section(parent, '/nameservers', function () {
		this.list = getJSON
		this.replace = putJSON
	})
}

function PendingUpdates (parent) {
	return new Section(parent, '/pending', function () {
		this.list = getJSON
	})
}

function Contacts (parent) {
	function Contact (type) {
		return new Section(Contact, '/' + encodeURIComponent(type), function () {
			this.get = getJSON
			this.replace = putJSON
			this.update = patchJSON
		})
	}
	Section.call(Contact, parent, '/contacts', function () {
		this.get = getJSON
		this.replace = putJSON
		this.update = patchJSON
	})
	return Contact
}

function Domains (parent) {
	function Domain (domain) {
		return new Section(Domain, '/' + encodeURIComponent(domain), function () {
			this.get = getJSON
			this.update = patchJSON
			this.nameservers = Nameservers(this)
			this.pending = PendingUpdates(this)
			this.contacts = Contacts(this)
			this.records = Records(this)
			this.zone = Zone(this)
			this.apps = DomainApps(this)
		})
	}
	Section.call(Domain, parent, '/domains', function () {
		this.list = getJSON
	})
	return Domain
}

function Transfers (parent) {
	function Transfer (domain) {
		return new Section(Transfer, '/' + encodeURIComponent(domain), function () {
			this.replace = putJSON
		})
	}
	Section.call(Transfer, parent, '/transfers', function () {
		this.list = getJSON
	})
	return Transfer
}

function Records (parent) {
	function Record (id) {
		return new Section(Record, '/' + encodeURIComponent(id), function () {
			this.del = deleteJSON
		})
	}
	Section.call(Record, parent, '/records', function () {
		this.list = getJSON
		this.create = postJSON
		this.replace = putJSON
	})
	return Record
}

function Zone (parent) {
	return new Section(parent, '/zone', function () {
		this.get = getText
		this.replace = putText
	})
}

function Apps (parent) {
	function App (app) {
		return new Section(App, '/' + encodeURIComponent(app), function () {
			this.get = getJSON
		})
	}
	Section.call(App, parent, '/apps', function () {
		this.list = getJSON
	})
	return App
}

function DomainApps (parent) {
	function DomainApp (id) {
		return new Section(DomainApp, '/' + encodeURIComponent(id), function () {
			this.del = deleteJSON
		})
	}
	Section.call(DomainApp, parent, '/apps', function () {
		this.list = getJSON
		this.create = postJSON
	})
	return DomainApp
}

function Account (parent) {
	return new Section(parent, '/account', function () {
		this.get = getJSON
		this.update = patchJSON
		this.default_nameservers = DefaultNameservers(this)
		this.default_contact = DefaultContact(this)
		this.billing = BillingProfiles(this)
		this.receipts = Receipts(this)
	})
}

function DefaultNameservers (parent) {
	return new Section(parent, '/default_nameservers', function () {
		this.list = getJSON
		this.replace = putJSON
	})
}

function DefaultContact (parent) {
	return new Section(parent, '/default_contact', function () {
		this.get = getJSON
		this.update = patchJSON
		this.replace = putJSON
	})
}

function BillingProfiles (parent) {
	function BillingProfile (id) {
		return new Section(BillingProfile, '/' + encodeURIComponent(id), function () {
			this.del = deleteJSON
		})
	}
	Section.call(BillingProfile, parent, '/billing', function () {
		this.list = getJSON
		this.create = postJSON
	})
	return BillingProfile
}

function Receipts (parent) {
	function Receipt (id) {
		return new Section(Receipt, '/' + encodeURIComponent(id), function () {
			this.get = getJSON
		})
	}
	Section.call(Receipt, parent, '/receipts', function () {
		this.list = getJSON
	})
	return Receipt
}

function Products (parent) {
	function Product (product) {
		return new Section(Product, '/' + encodeURIComponent(product), function () {
			this.get = getJSON
		})
	}
	Section.call(Product, parent, '/products', function () {
		this.list = getJSON
	})
	return Product
}

function TLDs (parent) {
	function TLD (tld) {
		return new Section(TLD, '/' + encodeURIComponent(tld), function () {
			this.get = getJSON
		})
	}
	Section.call(TLD, parent, '/tlds', function () {
		this.list = getJSON
	})
	return TLD
}

function SearchResults (parent) {
	function SearchResult (domain) {
		return new Section(SearchResult, '/' + encodeURIComponent(domain), function () {
			this.get = getJSON
		})
	}
	Section.call(SearchResult, parent, '/search/results', function () {
		this.list = getJSON
	})
	return SearchResult
}
