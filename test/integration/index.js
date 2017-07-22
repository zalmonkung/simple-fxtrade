require('dotenv').load({silent: true});
import _ from 'lodash';
import { expect } from 'chai';
import fx from '../../index';

const id = '101-011-5748031-001';

describe('--- Integration Tests ---', () => {
  describe('accounts', () => {
    describe('GET /accounts[/:id]', () => {
      it('should get the accounts', async () => {
        const {accounts} = await fx.accounts()

        expect(_.size(accounts)).to.be.equal(1);
      });

      it('should return the account by id', async () => {
        const {account} = await fx.accounts({id});

        expect(account.id).to.be.equal(id);
        expect(account.alias).to.be.equal('Primary');
      });
    });

    describe( 'PATCH /accounts/:id', () => {
      it('should configure the account', async () => {
        const { clientConfigureTransaction: { alias }} = await fx('patch').accounts({ id, alias: 'Default' });
        expect(alias).to.be.equal('Default');

        // Change back to Primary
        fx('patch').accounts({ id, alias: 'Primary' });
      });
    });

    describe('GET /accounts/:id/summary', () => {
      it('should return the account summary', async () => {
        fx.setAccount(id)
        const {account} = await fx.summary()

        expect(account.id).to.be.equal(id);
      });
    });

    describe('GET /accounts/:id/instruments', () => {
      it('should return the account instruments', async () => {
        fx.setAccount(id);
        const { instruments } = await fx.instruments()

        const pair = _.first(_.filter(instruments,{ name: 'AUD_USD' }));

        expect(pair.displayName).to.be.equal('AUD/USD');
      });
    })

    describe('GET /accounts/:id/changes', () => {
      it('should return the account changes',async () => {
        fx.setAccount(id);
        const { changes: { transactions }} = await fx.changes({ sinceTransactionID: 219 });

        expect(_.isEmpty(transactions)).to.not.be.ok;
      })
    });
  });

  describe('candles', () => {
    describe('GET /instruments/:accountId/candles', () => {
      it('should return the candles for a given instrument', async () => {
        fx.setAccount(id);

        const {granularity, candles, instrument} = await fx.candles({ id: 'AUD_USD' });
        expect(instrument).to.be.equal('AUD_USD');
        expect(granularity).to.be.equal('S5');
        expect(_.size(candles)).to.be.equal(500);
      });
    });
  });

  describe('pricing', () => {
    describe('GET /accounts/:id/pricing', () => {
      it('should return the pricing for an instrument', async () => {
        fx.setAccount(id);

        const {prices: [{instrument, type}]} = await fx.pricing({ instruments: 'AUD_USD' });
        expect(instrument).to.be.equal('AUD_USD');
        expect(type).to.be.equal('PRICE');
      });
    });

    describe('GET /accounts/:id/pricing/stream', () => {
      it('should throw an error if missing required params', () => {
        fx.setAccount(id);
         expect(() => fx.pricing.stream()).to.throw('Required parameters missing: instruments');
      });

      it('should subscribe to the pricing stream', (done) => {
        fx.setAccount(id);
        const stream = fx.pricing.stream({instruments: 'AUD_USD'});
        stream.on('data', ({ type }) => {
          expect(type).to.match(/PRICE|HEARTBEAT/);
          stream.disconnect();
          done();
        });
      });
    });

  });

  describe('transactions', () => {
    describe('GET /accounts/:accountId/transactions[/:id]', () => {
      it('should throw an error if missing required params', async () => {
        fx.setAccount(id);
        const { count, pageSize } = await fx.transactions();
        expect(count).to.be.above(50);
        expect(pageSize).to.be.equal(100);
      })

      it('should return a specified transaction id', async () => {
        fx.setAccount(id);
        const { transaction: { alias, type }} = await fx.transactions({ id: 10 });
        expect(type).to.be.equal('CLIENT_CONFIGURE');
        expect(alias).to.be.equal('Default');
      });
    });

    describe('GET /accounts/:accountId/transactions/stream', () =>
      it('should subscribe to the transactions stream', (done) => {
        fx.setAccount(id);
        const stream = fx.transactions.stream();
        stream.on('data', ({ type }) => {
          expect(type).to.be.equal('HEARTBEAT');
          stream.disconnect();
          done();
        });
      })
    );
  });

  // TODO: Need to fix up these integration tests. Problem is they depend
  // on timing and other irritating factors
  describe('trades', () => {
    describe('GET /accounts/:accountId/trades[/:id]', () => {
      // TODO: Need to return actual trades
      it('should throw an error if missing required params', async () =>{
        fx.setAccount(id);

        const {trades} = await fx.trades();
        expect(trades).to.be.ok;
      });
    });
  });

  describe.skip('orders', () => {
    describe('POST /accounts/:accountId/orders', () => {
      it('should create an order', async () => {
        fx.setAccount(id);

        const result = await fx.orders.create({
          order: {
            id,
            units: 1,
            instrument: 'AUD_USD',
            timeInForce: 'FOK',
            type: 'MARKET',
            positionFill: 'DEFAULT',
            tradeId: 6368,
          }
        });

      });

      it('should return the orders for an account');
    });
  });

  // TODO: Implement these integration tests if possible
  describe.skip('positions', () => '');
});
