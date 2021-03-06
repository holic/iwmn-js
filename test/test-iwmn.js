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

        var types = ['Owner', 'Admin', 'Tech', 'Billing']
        types.forEach(function (type) {
          var key = type.toLowerCase()

          describe(type + ' Contact', function () {
            it('has ' + key + ' contact endpoint', function () {
              expect(iwmn.domains('example.com').contacts[key]).to.be.ok()
            })
            it('can get ' + key + ' contact', function (done) {
              expect(iwmn.domains('example.com').contacts[key].get).to.be.a('function')

              mitm.on('request', expectRequest('GET', '/domains/example.com/contacts/' + key))
              iwmn.domains('example.com').contacts[key].get(function () {
                done()
              })
            })
            it('can update the ' + key + ' contact', function (done) {
              expect(iwmn.domains('example.com').contacts[key].update).to.be.a('function')

              mitm.on('request', expectRequest('PATCH', '/domains/example.com/contacts/' + key, '{"first_name":"John"}'))
              iwmn.domains('example.com').contacts[key].update({ first_name: 'John' }, function () {
                done()
              })
            })
            it('can replace the ' + key + ' contact', function (done) {
              expect(iwmn.domains('example.com').contacts[key].replace).to.be.a('function')

              mitm.on('request', expectRequest('PUT', '/domains/example.com/contacts/' + key, '{"first_name":"John"}'))
              iwmn.domains('example.com').contacts[key].replace({ first_name: 'John' }, function () {
                done()
              })
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
        it('has a zone file endpoint', function () {
          expect(iwmn.domains('example.com').zone).to.be.ok()
        })
        it('can get the zone file', function (done) {
          expect(iwmn.domains('example.com').zone.get).to.be.a('function')

          mitm.on('request', function (req, res) {
            expect(req.method).to.be('GET')
            expect(req.url).to.be('/domains/example.com/zone')
            expect(req.headers.host).to.be('api.iwantmyname.com')
            expect(req.headers.accept).to.be('text/plain')
            expect(req.headers.authorization).to.be('EXAMPLE_TOKEN')
            res.end()
          })

          iwmn.domains('example.com').zone.get(function () {
            done()
          })
        })
        it('can replace the zone file', function (done) {
          expect(iwmn.domains('example.com').zone.replace).to.be.a('function')

          mitm.on('request', function (req, res) {
            expect(req.method).to.be('PUT')
            expect(req.url).to.be('/domains/example.com/zone')
            expect(req.headers.host).to.be('api.iwantmyname.com')
            expect(req.headers.accept).to.be('text/plain')
            expect(req.headers.authorization).to.be('EXAMPLE_TOKEN')

            expect(req.headers['content-type']).to.be('text/plain')
            req.setEncoding('utf8')
            req.on('data', function (data) {
              expect(data).to.be('$ORIGIN example.com.')
              res.end()
            })
          })

          iwmn.domains('example.com').zone.replace('$ORIGIN example.com.', function () {
            done()
          })
        })
      })

      describe('Services', function () {
        it('has a services endpoint', function () {
          expect(iwmn.domains('example.com').services).to.be.ok()
        })
        it('can list services', function (done) {
          expect(iwmn.domains('example.com').services.list).to.be.a('function')

          mitm.on('request', expectRequest('GET', '/domains/example.com/services'))
          iwmn.domains('example.com').services.list(function () {
            done()
          })
        })
        it('can create services', function (done) {
          expect(iwmn.domains('example.com').services.create).to.be.a('function')

          mitm.on('request', expectRequest('POST', '/domains/example.com/services', '{"service":"Tumblr"}'))
          iwmn.domains('example.com').services.create({ service: 'Tumblr' }, function () {
            done()
          })
        })

        describe('Service', function () {
          it('has a service endpoint constructor', function () {
            expect(iwmn.domains('example.com').services).to.be.a('function')
          })
          it('can create a service endpoint', function () {
            expect(iwmn.domains('example.com').services(1)).to.be.ok()
          })
          it('can delete a service', function (done) {
            expect(iwmn.domains('example.com').services(1).del).to.be.a('function')

            mitm.on('request', expectRequest('DELETE', '/domains/example.com/services/1'))
            iwmn.domains('example.com').services(1).del(function () {
              done()
            })
          })
        })
      })
    })
  })

  describe('Domain Transfers', function () {
    it('has a transfers endpoint', function () {
      expect(iwmn.transfers).to.be.ok()
    })
    it('can list transfers', function (done) {
      expect(iwmn.transfers.list).to.be.a('function')

      mitm.on('request', expectRequest('GET', '/transfers'))
      iwmn.transfers.list(function () {
        done()
      })
    })

    describe('Transfer', function () {
      it('has a transfer endpoint constructor', function () {
        expect(iwmn.transfers).to.be.a('function')
      })
      it('has a transfer endpoint', function () {
        expect(iwmn.transfers('example.com')).to.be.ok()
      })
      it('can replace a transfer', function (done) {
        expect(iwmn.transfers('example.com').replace).to.be.a('function')

        mitm.on('request', expectRequest('PUT', '/transfers/example.com', '{"transfer_code":"EXAMPLE"}'))
        iwmn.transfers('example.com').replace({ transfer_code: "EXAMPLE" }, function () {
          done()
        })
      })
    })
  })

  describe('One-click Services', function () {
    it('has a services endpoint', function () {
      expect(iwmn.services).to.be.ok()
    })
    it('can list services', function (done) {
      expect(iwmn.services.list).to.be.a('function')

      mitm.on('request', expectRequest('GET', '/services'))
      iwmn.services.list(function () {
        done()
      })
    })

    describe('Service', function () {
      it('has a service endpoint constructor', function () {
        expect(iwmn.services).to.be.a('function')
      })
      it('has a service endpoint', function () {
        expect(iwmn.services('tumblr')).to.be.ok()
      })
      it('can get a service', function (done) {
        expect(iwmn.services('tumblr').get).to.be.a('function')

        mitm.on('request', expectRequest('GET', '/services/tumblr'))
        iwmn.services('tumblr').get(function () {
          done()
        })
      })
    })
  })

  describe('Account', function () {
    it('has an account endpoint', function () {
      expect(iwmn.account).to.be.ok()
    })
    it('can get account details', function (done) {
      expect(iwmn.account.get).to.be.a('function')

      mitm.on('request', expectRequest('GET', '/account'))
      iwmn.account.get(function () {
        done()
      })
    })
    it('can update account details', function (done) {
      expect(iwmn.account.update).to.be.a('function')

      mitm.on('request', expectRequest('PATCH', '/account', '{"username":"john@example.com"}'))
      iwmn.account.update({ username: 'john@example.com' }, function () {
        done()
      })
    })

    describe('Default Contact', function () {
      it('has a default contact endpoint', function () {
        expect(iwmn.account.default_contact).to.be.ok()
      })
      it('can get default contact details', function (done) {
        expect(iwmn.account.default_contact.get).to.be.a('function')

        mitm.on('request', expectRequest('GET', '/account/contacts/default'))
        iwmn.account.default_contact.get(function () {
          done()
        })
      })
      it('can update default contact details', function (done) {
        expect(iwmn.account.default_contact.update).to.be.a('function')

        mitm.on('request', expectRequest('PATCH', '/account/contacts/default', '{"first_name":"John"}'))
        iwmn.account.default_contact.update({ first_name: 'John' }, function () {
          done()
        })
      })
      it('can replace default contact details', function (done) {
        expect(iwmn.account.default_contact.replace).to.be.a('function')

        mitm.on('request', expectRequest('PUT', '/account/contacts/default', '{"first_name":"John"}'))
        iwmn.account.default_contact.replace({ first_name: 'John' }, function () {
          done()
        })
      })
    })

    describe('Default Nameservers', function () {
      it('has a default nameservers endpoint', function () {
        expect(iwmn.account.default_nameservers).to.be.ok()
      })
      it('can list default nameservers', function (done) {
        expect(iwmn.account.default_nameservers.list).to.be.a('function')

        mitm.on('request', expectRequest('GET', '/account/nameservers/default'))
        iwmn.account.default_nameservers.list(function () {
          done()
        })
      })
      it('can replace default nameservers', function (done) {
        expect(iwmn.account.default_nameservers.replace).to.be.a('function')

        mitm.on('request', expectRequest('PUT', '/account/nameservers/default', '["ns1.dnsimple.com","ns2.dnsimple.com"]'))
        iwmn.account.default_nameservers.replace(['ns1.dnsimple.com', 'ns2.dnsimple.com'], function () {
          done()
        })
      })
    })

    describe('Default Billing Profile', function () {
      it('has a default billing profile endpoint', function () {
        expect(iwmn.account.default_billing).to.be.ok()
      })
      it('can get the default billing profile', function (done) {
        expect(iwmn.account.default_billing.get).to.be.a('function')

        mitm.on('request', expectRequest('GET', '/account/billing/default'))
        iwmn.account.default_billing.get(function () {
          done()
        })
      })
      it('can create replace the default profile', function (done) {
        expect(iwmn.account.default_billing.replace).to.be.a('function')

        mitm.on('request', expectRequest('PUT', '/account/billing/default', '{"number":"4444111144441111"}'))
        iwmn.account.default_billing.replace({ number: "4444111144441111" }, function () {
          done()
        })
      })
      it('can delete the default billing profile', function (done) {
        expect(iwmn.account.default_billing.del).to.be.a('function')

        mitm.on('request', expectRequest('DELETE', '/account/billing/default'))
        iwmn.account.default_billing.del(function () {
          done()
        })
      })
    })

    describe('Receipts', function () {
      it('has a receipts endpoint', function () {
        expect(iwmn.account.receipts).to.be.ok()
      })
      it('can list receipts', function (done) {
        expect(iwmn.account.receipts.list).to.be.a('function')

        mitm.on('request', expectRequest('GET', '/account/receipts'))
        iwmn.account.receipts.list(function () {
          done()
        })
      })

      describe('Receipt', function () {
        it('has a receipt endpoint constructor', function () {
          expect(iwmn.account.receipts).to.be.a('function')
        })
        it('has a receipt endpoint', function () {
          expect(iwmn.account.receipts(1)).to.be.ok()
        })
        it('can get a receipt', function (done) {
          expect(iwmn.account.receipts(1).get).to.be.a('function')

          mitm.on('request', expectRequest('GET', '/account/receipts/1'))
          iwmn.account.receipts(1).get(function () {
            done()
          })
        })
      })
    })
  })

  describe('Products', function () {
    it('has a products endpoint', function () {
      expect(iwmn.products).to.be.ok()
    })
    it('can list products', function (done) {
      expect(iwmn.products.list).to.be.a('function')

      mitm.on('request', expectRequest('GET', '/products'))
      iwmn.products.list(function () {
        done()
      })
    })

    describe('Product', function () {
      it('has a product endpoint constructor', function () {
        expect(iwmn.products).to.be.a('function')
      })
      it('has a product endpoint', function () {
        expect(iwmn.products('com')).to.be.ok()
      })
      it('can get a product', function (done) {
        expect(iwmn.products('com').get).to.be.a('function')

        mitm.on('request', expectRequest('GET', '/products/com'))
        iwmn.products('com').get(function () {
          done()
        })
      })
    })
  })

  describe('TLDs', function () {
    it('has a TLDs endpoint', function () {
      expect(iwmn.tlds).to.be.ok()
    })
    it('can list TLDs', function (done) {
      expect(iwmn.tlds.list).to.be.a('function')

      mitm.on('request', expectRequest('GET', '/tlds'))
      iwmn.tlds.list(function () {
        done()
      })
    })

    describe('TLD', function () {
      it('has a TLD endpoint constructor', function () {
        expect(iwmn.tlds).to.be.a('function')
      })
      it('has a TLD endpoint', function () {
        expect(iwmn.tlds('com')).to.be.ok()
      })
      it('can get a TLD', function (done) {
        expect(iwmn.tlds('com').get).to.be.a('function')

        mitm.on('request', expectRequest('GET', '/tlds/com'))
        iwmn.tlds('com').get(function () {
          done()
        })
      })
    })
  })

  describe('Search Results', function () {
    it('has a search results endpoint', function () {
      expect(iwmn.search).to.be.ok()
      expect(iwmn.search.results).to.be.ok()
    })
    it('can list search results', function (done) {
      expect(iwmn.search.results.list).to.be.a('function')

      mitm.on('request', expectRequest('GET', '/search/results?q=Acme%20Inc.'))
      iwmn.search.results.list({ q: 'Acme Inc.' }, function () {
        done()
      })
    })

    describe('Result', function () {
      it('has a search result endpoint constructor', function () {
        expect(iwmn.search.results).to.be.a('function')
      })
      it('has a search result endpoint', function () {
        expect(iwmn.search.results('example.com')).to.be.ok()
      })
      it('can get a search result', function (done) {
        expect(iwmn.search.results('example.com').get).to.be.a('function')

        mitm.on('request', expectRequest('GET', '/search/results/example.com'))
        iwmn.search.results('example.com').get(function () {
          done()
        })
      })
    })
  })
})
