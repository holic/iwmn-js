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


function list (done) {
	return request
		.get(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'application/json')
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}
function get (done) {
	return request
		.get(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'application/json')
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}
function create (data, done) {
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
function update (data, done) {
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
function replace (data, done) {
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
function del (done) {
	return request
		.del(this.url())
		.set('Authorization', this.token())
		.set('Accept', 'application/json')
		.end(function (err, res) {
			done && done(err, res.body, res)
		})
}


function Nameservers (parent) {
	return new Section(parent, '/nameservers', function () {
		this.list = list
		this.replace = replace
	})
}

function PendingUpdates (parent) {
	return new Section(parent, '/pending', function () {
		this.list = list
	})
}

function Contacts (parent) {
	function Contact (type) {
		return new Section(Contact, '/' + encodeURIComponent(type), function () {
			this.get = get
			this.replace = replace
			this.update = update
		})
	}
	Section.call(Contact, parent, '/contacts', function () {
		this.get = get
		this.replace = replace
		this.update = update
	})
	return Contact
}

function Domains (parent) {
	function Domain (domain) {
		return new Section(Domain, '/' + encodeURIComponent(domain), function () {
			this.get = get
			this.update = update
			this.nameservers = Nameservers(this)
			this.pending = PendingUpdates(this)
			this.contacts = Contacts(this)
			this.records = Records(this)
			this.zone = Zone(this)
			this.apps = DomainApps(this)
		})
	}
	Section.call(Domain, parent, '/domains', function () {
		this.list = list
	})
	return Domain
}

function Transfers (parent) {
	function Transfer (domain) {
		return new Section(Transfer, '/' + encodeURIComponent(domain), function () {
			this.replace = replace
		})
	}
	Section.call(Transfer, parent, '/transfers', function () {
		this.list = list
	})
	return Transfer
}

function Records (parent) {
	function Record (id) {
		return new Section(Record, '/' + encodeURIComponent(id), function () {
			this.del = del
		})
	}
	Section.call(Record, parent, '/records', function () {
		this.list = list
		this.create = create
		this.replace = replace
	})
	return Record
}

function Zone (parent) {
	return new Section(parent, '/zone', function () {
		this.get = get
		this.replace = replace
	})
}

function Apps (parent) {
	return new Section(parent, '/apps', function () {
		this.list = list
	})
}

function DomainApps (parent) {
	function DomainApp (id) {
		return new Section(DomainApp, '/' + encodeURIComponent(id), function () {
			this.del = del
		})
	}
	Section.call(DomainApp, parent, '/apps', function () {
		this.list = list
		this.create = create
	})
	return DomainApp
}

function Account (parent) {
	return new Section(parent, '/account', function () {
		this.get = get
		this.update = update
		this.default_nameservers = DefaultNameservers(this)
		this.default_contact = DefaultContact(this)
		this.billing = BillingProfiles(this)
		this.receipts = Receipts(this)
	})
}

function DefaultNameservers (parent) {
	return new Section(parent, '/default_nameservers', function () {
		this.list = list
		this.replace = replace
	})
}

function DefaultContact (parent) {
	return new Section(parent, '/default_contact', function () {
		this.get = get
		this.update = update
		this.replace = replace
	})
}

function BillingProfiles (parent) {
	function BillingProfile (id) {
		return new Section(BillingProfile, '/' + encodeURIComponent(id), function () {
			this.del = del
		})
	}
	Section.call(BillingProfile, parent, '/billing', function () {
		this.list = list
		this.create = create
	})
	return BillingProfile
}

function Receipts (parent) {
	function Receipt (id) {
		return new Section(Receipt, '/' + encodeURIComponent(id), function () {
			this.get = get
		})
	}
	Section.call(Receipt, parent, '/receipts', function () {
		this.list = list
	})
	return Receipt
}

function Products (parent) {
	function Product (product) {
		return new Section(Product, '/' + encodeURIComponent(product), function () {
			this.get = get
		})
	}
	Section.call(Product, parent, '/products', function () {
		this.list = list
	})
	return Product
}

function TLDs (parent) {
	function TLD (tld) {
		return new Section(TLD, '/' + encodeURIComponent(tld), function () {
			this.get = get
		})
	}
	Section.call(TLD, parent, '/tlds', function () {
		this.list = list
	})
	return TLD
}

function SearchResults (parent) {
	function SearchResult (domain) {
		return new Section(SearchResult, '/' + encodeURIComponent(domain), function () {
			this.get = get
		})
	}
	Section.call(SearchResult, parent, '/search/results', function () {
		this.list = list
	})
	return SearchResult
}
