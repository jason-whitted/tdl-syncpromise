# Synchronous Promise

The [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) object by its very nature is asynchronous.  Let's flip that on its head!

Create a `SyncPromise` object.  This will be similar to a Promise, but with a couple differences.
1. It will be synchronous only.
2. It will have a `finally()` method to allow observation of the current status/value.

## Constructor
The contructor should take a resolver function as an argument.

```js
const promise = new SyncPromise((resolve, reject) => {
  if (Date.now() % 2 === 1) {
    reject('odd');
  }
  resolve('even');
});
```

Initially the SyncPromise should have the status of `'Pending'` and the value of `undefined`.  Calling `resolve(value)` will update the value and set the status to `'Resolved'`.  Calling `reject(value)` will update the value and set the status to `'Rejected'`.  If an error is thrown it will be treated as calling `reject(error)`.  Only the first call to `resolve` or `reject` will update the value.  Subsequent calls to `resolve` or `reject` have no affect on the status or value.

-----
## `.then(onResolved)`
The `then()` method returns a `SyncPromise`.  If `then()` is called while in the 'Pending' status an error will be thrown.

### Syntax
```js
p.then(onResolved);

p.then(function(value) {
  // fulfillment
  return newValue;
});
```

#### Parameters

##### onResolved
A Function called if the SyncPromise is currently 'Resolved'.  This function has one argument, the current value.  Executing this function has two possible results:
- The function returns a value.  The SyncPromise's value is set to the result and the status remains 'Resolved'.
- The function throws an error.  The SyncPromise's value is set to the error and the status is changed to 'Rejected'.

-----
## `.catch(onRejected)`
The `catch()` method returns a `SyncPromise`.  If `catch()` is called while in the 'Pending' status an error will be thrown.

### Syntax
```js
p.catch(onRejected);

p.catch(function(value) {
  // rejection
  return newValue;
});
```

#### Parameters

##### onRejected
A Function called if the SyncPromise is currently 'Rejected'.  This function has one argument, the current value.  Executing this function has two possible results:
- The function returns a value.  The SyncPromise's value is set to the result and the status is changed to 'Resolved'.
- The function throws an error.  The SyncPromise's value is set to the error and the status remains 'Rejected'.

-----
## `.finally(onFinally)`
The `finally()` method returns a value.  Calling the `finally()` method does not change the status or value of the SyncPromise.

### Syntax
```js
p.finally(onFinally);

p.finally(function(state) {
  state.status; // Current status: 'Pending', 'Resolved', or 'Rejected'
  state.value; // Current value
  return aValue;
});
```

#### Parameters

##### onFinally
A Function called (regardless of SyncPromise status).  This function has one argument, the object containing the current status and value of the SyncPromise.  This `finally()` method returns the result of the onFinally function.
