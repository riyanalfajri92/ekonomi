// A cached response from an older deployment must not replace a newer bundled snapshot.
export function acceptPacket(current,incoming){
 if(incoming?.schemaVersion!==1||!Array.isArray(incoming.metrics))return false;
 if(!current)return true;const stamp=x=>Date.parse(x?.pipeline?.finishedAt||x?.checkedAt||'');const a=stamp(current),b=stamp(incoming);
 if(Number.isFinite(a)&&b===a&&current.snapshotId&&incoming.snapshotId&&current.snapshotId!==incoming.snapshotId)return false;
 return !Number.isFinite(a)||Number.isFinite(b)&&b>=a;
}
