var request = require('superagent')

module.exports = IWMN


function IWMN (token) {
  this.TOKEN = token

  this.domains = Domains(this)
  this.transfers = Transfers(this)
  this.services = Services(this)
  this.account = Account(this)
  this.products = Products(this)
  this.tlds = TLDs(this)
  this.search = { results: SearchResults(this) }
}

IWMN.prototype.URL = 'https://api.iwantmyname.com'


function Section (parent, path, init) {
  this.PARENT = parent
  this.PATH = path

  init && init.call(this)
}

function url () {
  return this.PARENT
    ? url.call(this.PARENT) + this.PATH
    : this.URL
}
function token () {
  return this.PARENT
    ? token.call(this.PARENT)
    : this.TOKEN
}


function getJSON (query, done) {
  if (typeof query === 'function') {
    done = query
    query = null
  }
  return request
    .get(url.call(this))
    .query(query)
    .set('Authorization', token.call(this))
    .set('Accept', 'application/json')
    .end(function (err, res) {
      done && done(err, res.body, res)
    })
}
function postJSON (data, done) {
  return request
    .post(url.call(this))
    .set('Authorization', token.call(this))
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(data)
    .end(function (err, res) {
      done && done(err, res.body, res)
    })
}
function patchJSON (data, done) {
  return request
    .patch(url.call(this))
    .set('Authorization', token.call(this))
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(data)
    .end(function (err, res) {
      done && done(err, res.body, res)
    })
}
function putJSON (data, done) {
  return request
    .put(url.call(this))
    .set('Authorization', token.call(this))
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json')
    .send(data)
    .end(function (err, res) {
      done && done(err, res.body, res)
    })
}
function deleteJSON (done) {
  return request
    .del(url.call(this))
    .set('Authorization', token.call(this))
    .set('Accept', 'application/json')
    .end(function (err, res) {
      done && done(err, res.body, res)
    })
}


function getText (query, done) {
  if (typeof query === 'function') {
    done = query
    query = null
  }
  return request
    .get(url.call(this))
    .query(query)
    .set('Authorization', token.call(this))
    .set('Accept', 'text/plain')
    .end(function (err, res) {
      done && done(err, res.body, res)
    })
}
function putText (data, done) {
  return request
    .put(url.call(this))
    .set('Authorization', token.call(this))
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

function Contact (parent, type) {
  return new Section(parent, '/' + encodeURIComponent(type), function () {
    this.get = getJSON
    this.replace = putJSON
    this.update = patchJSON
  })
}

function Contacts (parent) {
  return new Section(parent, '/contacts', function () {
    this.get = getJSON
    this.replace = putJSON
    this.update = patchJSON
    this.owner = Contact(this, 'owner')
    this.admin = Contact(this, 'admin')
    this.tech = Contact(this, 'tech')
    this.billing = Contact(this, 'billing')
  })
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
      this.services = DomainServices(this)
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

function Services (parent) {
  function Service (service) {
    return new Section(Service, '/' + encodeURIComponent(service), function () {
      this.get = getJSON
    })
  }
  Section.call(Service, parent, '/services', function () {
    this.list = getJSON
  })
  return Service
}

function DomainServices (parent) {
  function DomainService (id) {
    return new Section(DomainService, '/' + encodeURIComponent(id), function () {
      this.del = deleteJSON
    })
  }
  Section.call(DomainService, parent, '/services', function () {
    this.list = getJSON
    this.create = postJSON
  })
  return DomainService
}

function Account (parent) {
  return new Section(parent, '/account', function () {
    this.get = getJSON
    this.update = patchJSON
    this.default_nameservers = DefaultNameservers(this)
    this.default_contact = DefaultContact(this)
    this.default_billing = DefaultBilling(this)
    this.receipts = Receipts(this)
  })
}

function DefaultNameservers (parent) {
  return new Section(parent, '/nameservers/default', function () {
    this.list = getJSON
    this.replace = putJSON
  })
}

function DefaultContact (parent) {
  return new Section(parent, '/contacts/default', function () {
    this.get = getJSON
    this.update = patchJSON
    this.replace = putJSON
  })
}

function DefaultBilling (parent) {
  return new Section(parent, '/billing/default', function () {
    this.get = getJSON
    this.replace = putJSON
    this.del = deleteJSON
  })
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
