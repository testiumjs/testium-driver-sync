import assert from 'assertive';
import {parseLogs, filterLogs} from '../../lib/browser/debug/console';

describe('parseLogs', () => {
  it('maps log levels to browser log types', () => {
    var logs = [ { level: 'SEVERE' } ];
    var parsed = parseLogs(logs);
    var log = parsed[0];

    assert.equal(log.level, undefined);
    assert.equal(log.type, 'error');
  });
});

describe('filterLogs', () => {
  it('returns all logs if no type is given', () => {
    var logs = [
      { type: 'error', message: 'something broke' },
      { type: 'log', message: 'things are working' }
    ];

    var { matched } = filterLogs(logs);
    assert.deepEqual(logs, matched);
  });

  it('filters logs based on type', () => {
    var errorItem = { type: 'error', message: 'something broke' };
    var logItem = { type: 'log', message: 'things are working' };
    var logs = [ logItem, errorItem ];

    var { matched, rest } = filterLogs(logs, 'error');
    assert.equal(errorItem, matched[0]);
    assert.equal(1, matched.length);
    assert.equal(logItem, rest[0]);
    assert.equal(1, rest.length);
  });
});
