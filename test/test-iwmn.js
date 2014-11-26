var expect = require('expect.js')
var Mitm = require('mitm')

var IWMN = require('..')


describe('IWMN Client', function () {
	var iwmn = new IWMN('EXAMPLE_TOKEN')
	var mitm

	beforeEach(function () {
		mitm = Mitm()
	})
	afterEach(function () {
		mitm.disable()
	})


	function expectRequest (method, url, body) {
		return function (req, res) {
			expect(req.method).to.be(method)
			expect(req.url).to.be(url)
			expect(req.headers.host).to.be('api.iwantmyname.com')
			expect(req.headers.accept).to.be('application/json')
			expect(req.headers.authorization).to.be('EXAMPLE_TOKEN')

			if (body) {
				expect(req.headers['content-type']).to.be('application/json')
				req.setEncoding('utf8')
				req.on('data', function (data) {
					expect(data).to.be(body)
					res.end()
				})
			}
			else {
				res.end()
			}
		}
	}


	it('has a token', function () {
		expect(iwmn.TOKEN).to.be('EXAMPLE_TOKEN')
	})

	describe('Domains', function () {
		it('has a domains endpoint', function () {
			expect(iwmn.domains).to.be.ok()
		})
		it('can list domains', function (done) {
			expect(iwmn.domains.list).to.be.a('function')

			mitm.on('request', expectRequest('GET', '/domains'))
			iwmn.domains.list(function () {
				done()
			})
		})

		describe('Domain', function () {
			it('has a domain endpoint constructor', function () {
				expect(iwmn.domains).to.be.a('function')
			})
			it('can create a domain endpoint', function () {
				expect(iwmn.domains('example.com')).to.be.ok()
			})
			it('can get a domain', function (done) {
				expect(iwmn.domains('example.com').get).to.be.a('function')

				mitm.on('request', expectRequest('GET', '/domains/example.com'))
				iwmn.domains('example.com').get(function () {
					done()
				})
			})
			it('can update a domain', function (done) {
				expect(iwmn.domains('example.com').update).to.be.a('function')

				mitm.on('request', expectRequest('PATCH', '/domains/example.com', '{"auto_renew":false}'))
				iwmn.domains('example.com').update({ auto_renew: false }, function () {
					done()
				})
			})

			describe('Nameservers', function () {
				it('has a nameservers endpoint', function () {
					expect(iwmn.domains('example.com').nameservers).to.be.ok()
				})
				it('can list nameservers', function (done) {
					expect(iwmn.domains('example.com').nameservers.list).to.be.a('function')

					mitm.on('request', expectRequest('GET', '/domains/example.com/nameservers'))
					iwmn.domains('example.com').nameservers.list(function () {
						done()
					})
				})
				it('can replace nameservers', function (done) {
					expect(iwmn.domains('example.com').nameservers.replace).to.be.a('function')

					mitm.on('request', expectRequest('PUT', '/domains/example.com/nameservers', '["ns1.dnsimple.com","ns2.dnsimple.com"]'))
					iwmn.domains('example.com').nameservers.replace(['ns1.dnsimple.com', 'ns2.dnsimple.com'], function () {
						done()
					})
				})
			})

			describe('Pending Updates', function () {
				it('has a pending updates endpoint', function () {
					expect(iwmn.domains('example.com').pending).to.be.ok()
				})
				it('can list pending updates', function (done) {
					expect(iwmn.domains('example.com').pending.list).to.be.a('function')

					mitm.on('request', expectRequest('GET', '/domains/example.com/pending'))
					iwmn.domains('example.com').pending.list(function () {
						done()
					})
				})
			})

			describe('Contacts', function () {
				it('has a contacts endpoint', function () {
					expect(iwmn.domains('example.com').contacts).to.be.ok()
				})
				it('can get contacts', function (done) {
					expect(iwmn.domains('example.com').contacts.get).to.be.a('function')

					mitm.on('request', expectRequest('GET', '/domains/example.com/contacts'))
					iwmn.domains('example.com').contacts.get(function () {
						done()
					})
				})
				it('can update contacts', function (done) {
					expect(iwmn.domains('example.com').contacts.update).to.be.a('function')

					mitm.on('request', expectRequest('PATCH', '/domains/example.com/contacts', '{"owner":{"first_name":"John"}}'))
					iwmn.domains('example.com').contacts.update({ owner: { first_name: 'John' } }, function () {
						done()
					})
				})
				it('can replace contacts', function (done) {
					expect(iwmn.domains('example.com').contacts.replace).to.be.a('function')

					mitm.on('request', expectRequest('PUT', '/domains/example.com/contacts', '{"owner":{"first_name":"John"}}'))
					iwmn.domains('example.com').contacts.replace({ owner: { first_name: 'John' } }, function () {
						done()
					})
				})

				describe('Contact', function () {
					it('has a contact endpoint constructor', function () {
						expect(iwmn.domains('example.com').contacts).to.be.a('function')
					})
					it('can create a contact endpoint', function () {
						expect(iwmn.domains('example.com').contacts('owner')).to.be.ok()
					})
					it('can get a contact', function (done) {
						expect(iwmn.domains('example.com').contacts('owner').get).to.be.a('function')

						mitm.on('request', expectRequest('GET', '/domains/example.com/contacts/owner'))
						iwmn.domains('example.com').contacts('owner').get(function () {
							done()
						})
					})
					it('can update a contact', function (done) {
						expect(iwmn.domains('example.com').contacts('owner').update).to.be.a('function')

						mitm.on('request', expectRequest('PATCH', '/domains/example.com/contacts/owner', '{"first_name":"John"}'))
						iwmn.domains('example.com').contacts('owner').update({ first_name: 'John' }, function () {
							done()
						})
					})
					it('can update a replace', function (done) {
						expect(iwmn.domains('example.com').contacts('owner').replace).to.be.a('function')

						mitm.on('request', expectRequest('PUT', '/domains/example.com/contacts/owner', '{"first_name":"John"}'))
						iwmn.domains('example.com').contacts('owner').replace({ first_name: 'John' }, function () {
							done()
						})
					})
				})
			})

			describe('DNS Records', function () {
				it('has a records endpoint', function () {
					expect(iwmn.domains('example.com').records).to.be.ok()
				})
				it('can list records', function (done) {
					expect(iwmn.domains('example.com').records.list).to.be.a('function')

					mitm.on('request', expectRequest('GET', '/domains/example.com/records'))
					iwmn.domains('example.com').records.list(function () {
						done()
					})
				})
				it('can create records', function (done) {
					expect(iwmn.domains('example.com').records.create).to.be.a('function')

					mitm.on('request', expectRequest('POST', '/domains/example.com/records', '{"type":"A"}'))
					iwmn.domains('example.com').records.create({ "type": "A" }, function () {
						done()
					})
				})
				it('can replace records', function (done) {
					expect(iwmn.domains('example.com').records.replace).to.be.a('function')

					mitm.on('request', expectRequest('PUT', '/domains/example.com/records', '[{"type":"A"}]'))
					iwmn.domains('example.com').records.replace([{ "type": "A" }], function () {
						done()
					})
				})

				describe('DNS Record', function () {
					it('has a record endpoint constructor', function () {
						expect(iwmn.domains('example.com').records).to.be.a('function')
					})
					it('can create a record endpoint', function () {
						expect(iwmn.domains('example.com').records(1)).to.be.ok()
					})
					it('can delete a record', function (done) {
						expect(iwmn.domains('example.com').records(1).del).to.be.a('function')

						mitm.on('request', expectRequest('DELETE', '/domains/example.com/records/1'))
						iwmn.domains('example.com').records(1).del(function () {
							done()
						})
					})
				})
			})

			describe('Zone File', function () {
				var zone = iwmn.domains('example.com').zone

				it('has a zone file endpoint', function () {
					expect(zone).to.be.ok()
					expect(zone.path).to.be.a('function')
					expect(zone.path()).to.be('/domains/example.com/zone')
					expect(zone.url).to.be.a('function')
					expect(zone.url()).to.be('https://api.iwantmyname.com/domains/example.com/zone')
				})
				it('can get the zone file', function () {
					expect(zone.get).to.be.a('function')
				})
				it('can replace the zone file', function () {
					expect(zone.replace).to.be.a('function')
				})
			})

			describe('Apps', function () {
				var apps = iwmn.domains('example.com').apps

				it('has an apps endpoint', function () {
					expect(apps).to.be.ok()
					expect(apps.path).to.be.a('function')
					expect(apps.path()).to.be('/domains/example.com/apps')
					expect(apps.url).to.be.a('function')
					expect(apps.url()).to.be('https://api.iwantmyname.com/domains/example.com/apps')
				})
				it('can list apps', function () {
					expect(apps.list).to.be.a('function')
				})
				it('can create apps', function () {
					expect(apps.create).to.be.a('function')
				})
				it('is an app endpoint constructor', function () {
					expect(apps).to.be.a('function')
				})

				describe('App', function () {
					var app = apps(1)

					it('can create an app endpoint', function () {
						expect(app).to.be.ok()
						expect(app.path).to.be.a('function')
						expect(app.path()).to.be('/domains/example.com/apps/1')
						expect(app.url).to.be.a('function')
						expect(app.url()).to.be('https://api.iwantmyname.com/domains/example.com/apps/1')
					})
					it('can delete an app', function () {
						expect(app.del).to.be.a('function')
					})
				})
			})
		})
	})

	describe('Domain Transfers', function () {
		var transfers = iwmn.transfers

		it('has a transfers endpoint', function () {
			expect(transfers).to.be.ok()
			expect(transfers.path).to.be.a('function')
			expect(transfers.path()).to.be('/transfers')
			expect(transfers.url).to.be.a('function')
			expect(transfers.url()).to.be('https://api.iwantmyname.com/transfers')
		})
		it('can list transfers', function () {
			expect(transfers.list).to.be.a('function')
		})
		it('is a transfer endpoint constructor', function () {
			expect(transfers).to.be.a('function')
		})

		describe('Transfer', function () {
			var transfer = transfers('example.com')

			it('has a transfer endpoint', function () {
				expect(transfer).to.be.ok()
				expect(transfer.path).to.be.a('function')
				expect(transfer.path()).to.be('/transfers/example.com')
				expect(transfer.url).to.be.a('function')
				expect(transfer.url()).to.be('https://api.iwantmyname.com/transfers/example.com')
			})
			it('can replace a transfer', function () {
				expect(transfer.replace).to.be.a('function')
			})
		})
	})

	describe('Apps & Services', function () {
		var apps = iwmn.apps

		it('has an apps endpoint', function () {
			expect(apps).to.be.ok()
			expect(apps.path).to.be.a('function')
			expect(apps.path()).to.be('/apps')
			expect(apps.url).to.be.a('function')
			expect(apps.url()).to.be('https://api.iwantmyname.com/apps')
		})
		it('can list apps', function () {
			expect(apps.list).to.be.a('function')
		})
	})

	describe('Account', function () {
		var account = iwmn.account

		it('has an account endpoint', function () {
			expect(account).to.be.ok()
			expect(account.path).to.be.a('function')
			expect(account.path()).to.be('/account')
			expect(account.url).to.be.a('function')
			expect(account.url()).to.be('https://api.iwantmyname.com/account')
		})
		it('can get account details', function () {
			expect(account.get).to.be.a('function')
		})
		it('can update account details', function () {
			expect(account.update).to.be.a('function')
		})

		describe('Default Contact', function () {
			var contact = account.default_contact

			it('has a default contact endpoint', function () {
				expect(contact).to.be.ok()
				expect(contact.path).to.be.a('function')
				expect(contact.path()).to.be('/account/default_contact')
				expect(contact.url).to.be.a('function')
				expect(contact.url()).to.be('https://api.iwantmyname.com/account/default_contact')
			})
			it('can get default contact details', function () {
				expect(contact.get).to.be.a('function')
			})
			it('can update default contact details', function () {
				expect(contact.update).to.be.a('function')
			})
			it('can replace default contact details', function () {
				expect(contact.replace).to.be.a('function')
			})
		})

		describe('Default Nameservers', function () {
			var nameservers = account.default_nameservers

			it('has a default nameservers endpoint', function () {
				expect(nameservers).to.be.ok()
				expect(nameservers.path).to.be.a('function')
				expect(nameservers.path()).to.be('/account/default_nameservers')
				expect(nameservers.url).to.be.a('function')
				expect(nameservers.url()).to.be('https://api.iwantmyname.com/account/default_nameservers')
			})
			it('can list default nameservers', function () {
				expect(nameservers.list).to.be.a('function')
			})
			it('can replace default nameservers', function () {
				expect(nameservers.replace).to.be.a('function')
			})
		})

		describe('Billing Profiles', function () {
			var billing = account.billing

			it('has a billing profiles endpoint', function () {
				expect(billing).to.be.ok()
				expect(billing.path).to.be.a('function')
				expect(billing.path()).to.be('/account/billing')
				expect(billing.url).to.be.a('function')
				expect(billing.url()).to.be('https://api.iwantmyname.com/account/billing')
			})
			it('can list billing profiles', function () {
				expect(billing.list).to.be.a('function')
			})
			it('can create billing profiles', function () {
				expect(billing.create).to.be.a('function')
			})
			it('is a billing profile endpoint constructor', function () {
				expect(billing).to.be.a('function')
			})

			describe('Profile', function () {
				var profile = billing(1)

				it('has a billing profile endpoint', function () {
					expect(profile).to.be.ok()
					expect(profile.path).to.be.a('function')
					expect(profile.path()).to.be('/account/billing/1')
					expect(profile.url).to.be.a('function')
					expect(profile.url()).to.be('https://api.iwantmyname.com/account/billing/1')
				})
				it('can delete a billing profile', function () {
					expect(profile.del).to.be.a('function')
				})
			})
		})

		describe('Receipts', function () {
			var receipts = account.receipts

			it('has a receipts endpoint', function () {
				expect(receipts).to.be.ok()
				expect(receipts.path).to.be.a('function')
				expect(receipts.path()).to.be('/account/receipts')
				expect(receipts.url).to.be.a('function')
				expect(receipts.url()).to.be('https://api.iwantmyname.com/account/receipts')
			})
			it('can list receipts', function () {
				expect(receipts.list).to.be.a('function')
			})
			it('is a receipt endpoint constructor', function () {
				expect(receipts).to.be.a('function')
			})

			describe('Receipt', function () {
				var receipt = receipts(1)

				it('has a receipt endpoint', function () {
					expect(receipt).to.be.ok()
					expect(receipt.path).to.be.a('function')
					expect(receipt.path()).to.be('/account/receipts/1')
					expect(receipt.url).to.be.a('function')
					expect(receipt.url()).to.be('https://api.iwantmyname.com/account/receipts/1')
				})
				it('can get a receipt', function () {
					expect(receipt.get).to.be.a('function')
				})
			})
		})
	})

	describe('Products', function () {
		var products = iwmn.products

		it('has a products endpoint', function () {
			expect(products).to.be.ok()
			expect(products.path).to.be.a('function')
			expect(products.path()).to.be('/products')
			expect(products.url).to.be.a('function')
			expect(products.url()).to.be('https://api.iwantmyname.com/products')
		})
		it('can list products', function () {
			expect(products.list).to.be.a('function')
		})
		it('is a product endpoint constructor', function () {
			expect(products).to.be.a('function')
		})

		describe('Product', function () {
			var product = products('com')

			it('has a product endpoint', function () {
				expect(product).to.be.ok()
				expect(product.path).to.be.a('function')
				expect(product.path()).to.be('/products/com')
				expect(product.url).to.be.a('function')
				expect(product.url()).to.be('https://api.iwantmyname.com/products/com')
			})
			it('can get a product', function () {
				expect(product.get).to.be.a('function')
			})
		})
	})

	describe('TLDs', function () {
		var tlds = iwmn.tlds

		it('has a TLDs endpoint', function () {
			expect(tlds).to.be.ok()
			expect(tlds.path).to.be.a('function')
			expect(tlds.path()).to.be('/tlds')
			expect(tlds.url).to.be.a('function')
			expect(tlds.url()).to.be('https://api.iwantmyname.com/tlds')
		})
		it('can list TLDs', function () {
			expect(tlds.list).to.be.a('function')
		})
		it('is a TLD endpoint constructor', function () {
			expect(tlds).to.be.a('function')
		})

		describe('TLD', function () {
			var tld = tlds('com')

			it('has a TLD endpoint', function () {
				expect(tld).to.be.ok()
				expect(tld.path).to.be.a('function')
				expect(tld.path()).to.be('/tlds/com')
				expect(tld.url).to.be.a('function')
				expect(tld.url()).to.be('https://api.iwantmyname.com/tlds/com')
			})
			it('can get a TLD', function () {
				expect(tld.get).to.be.a('function')
			})
		})
	})

	describe('Search Results', function () {
		var results = iwmn.searchResults

		it('has a search results endpoint', function () {
			expect(results).to.be.ok()
			expect(results.path).to.be.a('function')
			expect(results.path()).to.be('/search/results')
			expect(results.url).to.be.a('function')
			expect(results.url()).to.be('https://api.iwantmyname.com/search/results')
		})
		it('can list search results', function () {
			expect(results.list).to.be.a('function')
		})
		it('is a search result endpoint constructor', function () {
			expect(results).to.be.a('function')
		})

		describe('Result', function () {
			var result = results('example.com')

			it('has a search result endpoint', function () {
				expect(result).to.be.ok()
				expect(result.path).to.be.a('function')
				expect(result.path()).to.be('/search/results/example.com')
				expect(result.url).to.be.a('function')
				expect(result.url()).to.be('https://api.iwantmyname.com/search/results/example.com')
			})
			it('can get a search result', function () {
				expect(result.get).to.be.a('function')
			})
		})
	})
})
