import expect, { spyOn } from 'expect';

let SyncPromise;
try {
  SyncPromise = require('../SyncPromise.solution').default;
} catch (e) {
  SyncPromise = require('../SyncPromise').default;
}

const noop = () => {};
const resolve = value => resolve => resolve(value);
const reject = value => (_, reject) => reject(value);
const abort = value => () => {
  throw value;
};

describe('SyncPromise', () => {
  describe('constructor', () => {
    it('should be a function', () => {
      expect(SyncPromise).toBeA(Function);
    });

    it('should throw an error if the resolver is not supplied', () => {
      expect(() => new SyncPromise()).toThrow();
    });

    it('should throw an error if the resolver is not a function', () => {
      expect(() => new SyncPromise(123)).toThrow();
    });

    it('should return a SyncPromise object', () => {
      expect(new SyncPromise(noop)).toBeA(SyncPromise);
    });

    it('should have a then function', () => {
      expect(new SyncPromise(noop).then).toBeA(Function);
    });

    it('should have a catch function', () => {
      expect(new SyncPromise(noop).catch).toBeA(Function);
    });

    it('should have a finally function', () => {
      expect(new SyncPromise(noop).catch).toBeA(Function);
    });
  });

  describe('resolver', () => {
    it('should be called', () => {
      const spy = { resolver: noop };
      spyOn(spy, 'resolver');
      new SyncPromise(spy.resolver);
      expect(spy.resolver).toHaveBeenCalled('resolver was not called');
      expect(spy.resolver.calls.length).toBe(1, 'resolver should be called only once');
    });

    it('should pass 2 functions', () => {
      const spy = { resolver: noop };
      spyOn(spy, 'resolver');
      new SyncPromise(spy.resolver);
      const args = spy.resolver.calls[0].arguments;
      expect(args.length).toBe(2);
      expect(args[0]).toBeA(Function);
      expect(args[1]).toBeA(Function);
    });
  });

  describe('Pending', () => {
    describe('then()', () => {
      it('should throw an error', () => {
        expect(() => new SyncPromise(noop).then(noop)).toThrow();
      });
    });

    describe('catch()', () => {
      it('should throw an error', () => {
        expect(() => new SyncPromise(noop).catch(noop)).toThrow();
      });
    });

    describe('finally()', () => {
      it('should throw an error if no function is supplied', () => {
        expect(() => new SyncPromise(noop).finally()).toThrow();
      });

      it('should NOT throw an error if a function is supplied', () => {
        expect(() => new SyncPromise(noop).finally(noop)).toNotThrow();
      });

      it('should call the function', () => {
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(noop).finally(spy.onFinally);
        expect(spy.onFinally).toHaveBeenCalled('function was not called');
      });

      it('should pass an object containing status/value to the function', () => {
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(noop).finally(spy.onFinally);
        const args = spy.onFinally.calls[0].arguments[0];
        expect(args).toBeA('object');
        expect(args).toIncludeKeys(['status', 'value']);
        expect(args.status).toBe('Pending', `status: Expected ${args.status} to be 'Pending'`);
        expect(args.value).toBe(undefined, `value: Expected ${args.value} to be undefined`);
      });

      it('should return the result of the function', () => {
        const expected = Date.now() % 1337;
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally').andReturn(expected);
        const actual = new SyncPromise(noop).finally(spy.onFinally);
        expect(actual).toBe(expected);
      });
    });
  });

  describe('Resolved', () => {
    describe('then()', () => {
      it('should throw an error if no function is supplied', () => {
        expect(() => new SyncPromise(resolve()).then()).toThrow();
      });

      it('should NOT throw an error if a function is supplied', () => {
        expect(() => new SyncPromise(resolve()).then(noop)).toNotThrow();
      });

      it('should call the function', () => {
        const spy = { onResolved: noop };
        spyOn(spy, 'onResolved');
        new SyncPromise(resolve()).then(spy.onResolved);
        expect(spy.onResolved).toHaveBeenCalled('function was not called');
      });

      it('should pass the current value', () => {
        const expected = Date.now() % 21790;
        const spy = { onResolved: noop };
        spyOn(spy, 'onResolved');
        new SyncPromise(resolve(expected)).then(spy.onResolved);
        const actual = spy.onResolved.calls[0].arguments[0];
        expect(actual).toBe(expected);
      });

      it('should return the SyncPromise in order to support function chaining', () => {
        const promise = new SyncPromise(resolve()).then(noop);
        expect(promise).toBeA(SyncPromise);
      });
    });

    describe('catch()', () => {
      it('should throw an error if no function is supplied', () => {
        expect(() => new SyncPromise(resolve()).catch()).toThrow();
      });

      it('should NOT throw an error if a function is supplied', () => {
        expect(() => new SyncPromise(resolve()).catch(noop)).toNotThrow();
      });

      it('should NOT call the function', () => {
        const spy = { onRejected: noop };
        spyOn(spy, 'onRejected');
        new SyncPromise(resolve()).catch(spy.onRejected);
        expect(spy.onRejected).toNotHaveBeenCalled('function was called');
      });

      it('should return the SyncPromise in order to support function chaining', () => {
        const promise = new SyncPromise(resolve()).catch(noop);
        expect(promise).toBeA(SyncPromise);
      });
    });

    describe('finally()', () => {
      it('should throw an error if no function is supplied', () => {
        expect(() => new SyncPromise(resolve()).finally()).toThrow();
      });

      it('should NOT throw an error if a function is supplied', () => {
        expect(() => new SyncPromise(resolve()).finally(noop)).toNotThrow();
      });

      it('should call the function', () => {
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(resolve()).finally(spy.onFinally);
        expect(spy.onFinally).toHaveBeenCalled('function was not called');
      });

      it('should pass an object containing status/value to the function', () => {
        const expected = 'w00t';
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(resolve(expected)).finally(spy.onFinally);
        const args = spy.onFinally.calls[0].arguments[0];
        expect(args).toBeA('object');
        expect(args).toIncludeKeys(['status', 'value']);
        expect(args.status).toBe('Resolved', `status: Expected ${args.status} to be 'Resolved'`);
        expect(args.value).toBe(expected, `value: Expected ${args.value} to be undefined`);
      });

      it('should return the result of the function', () => {
        const expected = Date.now() % 1337;
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally').andReturn(expected);
        const actual = new SyncPromise(resolve()).finally(spy.onFinally);
        expect(actual).toBe(expected);
      });
    });
  });

  describe('Rejected', () => {
    describe('then()', () => {
      it('should throw an error if no function is supplied', () => {
        expect(() => new SyncPromise(reject()).then()).toThrow();
      });

      it('should NOT throw an error if a function is supplied', () => {
        expect(() => new SyncPromise(reject()).then(noop)).toNotThrow();
      });

      it('should NOT call the function', () => {
        const spy = { onResolved: noop };
        spyOn(spy, 'onResolved');
        new SyncPromise(reject()).then(spy.onResolved);
        expect(spy.onResolved).toNotHaveBeenCalled('function was called');
      });

      it('should return the SyncPromise in order to support function chaining', () => {
        const promise = new SyncPromise(reject()).then(noop);
        expect(promise).toBeA(SyncPromise);
      });
    });

    describe('catch()', () => {
      it('should throw an error if no function is supplied', () => {
        expect(() => new SyncPromise(reject()).catch()).toThrow();
      });

      it('should NOT throw an error if a function is supplied', () => {
        expect(() => new SyncPromise(reject()).catch(noop)).toNotThrow();
      });

      it('should call the function', () => {
        const spy = { onRejected: noop };
        spyOn(spy, 'onRejected');
        new SyncPromise(reject()).catch(spy.onRejected);
        expect(spy.onRejected).toHaveBeenCalled('function was not called');
      });

      it('should pass the current value', () => {
        const expected = Date.now() % 21790;
        const spy = { onRejected: noop };
        spyOn(spy, 'onRejected');
        new SyncPromise(reject(expected)).catch(spy.onRejected);
        const actual = spy.onRejected.calls[0].arguments[0];
        expect(actual).toBe(expected);
      });

      it('should return the SyncPromise in order to support function chaining', () => {
        const promise = new SyncPromise(resolve()).catch(noop);
        expect(promise).toBeA(SyncPromise);
      });
    });

    describe('finally()', () => {
      it('should throw an error if no function is supplied', () => {
        expect(() => new SyncPromise(reject()).finally()).toThrow();
      });

      it('should NOT throw an error if a function is supplied', () => {
        expect(() => new SyncPromise(reject()).finally(noop)).toNotThrow();
      });

      it('should call the function', () => {
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(reject()).finally(spy.onFinally);
        expect(spy.onFinally).toHaveBeenCalled('function was not called');
      });

      it('should pass an object containing status/value to the function', () => {
        const expected = '(o.O)';
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(reject(expected)).finally(spy.onFinally);
        const args = spy.onFinally.calls[0].arguments[0];
        expect(args).toBeA('object');
        expect(args).toIncludeKeys(['status', 'value']);
        expect(args.status).toBe('Rejected', `status: Expected ${args.status} to be 'Rejected'`);
        expect(args.value).toBe(expected, `value: Expected ${args.value} to be undefined`);
      });

      it('should return the result of the function', () => {
        const expected = Date.now() % 1337;
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally').andReturn(expected);
        const actual = new SyncPromise(reject()).finally(spy.onFinally);
        expect(actual).toBe(expected);
      });
    });
  });

  describe('Error Handling', () => {
    describe('resolver', () => {
      it('should catch errors being thrown', () => {
        const resolver = () => new SyncPromise(abort('ERR'));
        expect(resolver).toNotThrow();
      });

      it('should handle an error being thrown as a rejection', () => {
        const err = Error('¯\\_(ツ)_/¯');
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(abort(err)).finally(spy.onFinally);
        expect(spy.onFinally).toHaveBeenCalled();
        const args = spy.onFinally.calls[0].arguments[0];
        expect(args).toBeA('object').toContain({
          status: 'Rejected',
          value: err,
        });
      });
    });

    describe('then()', () => {
      it('should catch errors being thrown', () => {
        const then = () => new SyncPromise(resolve()).then(abort('Whoops'));
        expect(then).toNotThrow();
      });

      it('should handle an error being thrown as a rejection', () => {
        const err = Error('ಠ╭╮ಠ');
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(resolve()).then(abort(err)).finally(spy.onFinally);
        expect(spy.onFinally).toHaveBeenCalled();
        const args = spy.onFinally.calls[0].arguments[0];
        expect(args).toBeA('object').toContain({
          status: 'Rejected',
          value: err,
        });
      });
    });

    describe('catch()', () => {
      it('should catch errors being thrown', () => {
        const _catch = () => new SyncPromise(reject()).catch(abort('Hey!'));
        expect(_catch).toNotThrow();
      });

      it('should handle an error being thrown as a rejection', () => {
        const err = Error('⊙﹏⊙');
        const spy = { onFinally: noop };
        spyOn(spy, 'onFinally');
        new SyncPromise(reject()).catch(abort(err)).finally(spy.onFinally);
        expect(spy.onFinally).toHaveBeenCalled();
        const args = spy.onFinally.calls[0].arguments[0];
        expect(args).toBeA('object').toContain({
          status: 'Rejected',
          value: err,
        });
      });
    });
  });

  describe('Chaining', () => {
    describe('resolve->then->finally', () => {
      it('should call then', () => {
        new SyncPromise(resolve(80)).then(v => v * 3).finally(({ status, value }) => {
          expect(status).toBe('Resolved');
          expect(value).toBe(240);
        });
      });
    });

    describe('reject->then->catch->finally', () => {
      it('should skip then and call catch', () => {
        new SyncPromise(reject(80)).then(v => 'doh').catch(v => v * 3).finally(({ status, value }) => {
          expect(status).toBe('Resolved');
          expect(value).toBe(240);
        });
      });
    });

    describe('resolve->catch->then->finally', () => {
      it('should skip the catch and call then', () => {
        new SyncPromise(resolve(145)).catch(v => 'err').then(v => v + 3).finally(({ status, value }) => {
          expect(status).toBe('Resolved');
          expect(value).toBe(148);
        });
      });
    });

    describe('resolve->catch->then->catch->then->finally', () => {
      it('should skip the first catch and handle errors being thrown', () => {
        new SyncPromise(resolve(2))
          .catch(v => 0)
          .then(v => {
            throw 'err'.repeat(v);
          })
          .catch(v => v + 6)
          .then(v => {
            throw `!${v}`;
          })
          .finally(({ status, value }) => {
            expect(status).toBe('Rejected');
            expect(value).toBe('!errerr6');
          });
      });
    });

    describe('reject->then->catch->then->catch->finally', () => {
      it('should just work™', () => {
        new SyncPromise(reject(5))
          .then(v => v + '#')
          .catch(v => v - 1)
          .then(v => {
            throw v + 'H';
          })
          .catch(v => v.toString().toLowerCase())
          .finally(({ status, value }) => {
            expect(status).toBe('Resolved');
            expect(value).toBe('4h');
          });
      });
    });
  });
});
