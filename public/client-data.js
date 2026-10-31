// A cached API response cannot roll back the validated snapshot bundled with a newer deployment.
export function packetDecision(current,incoming){
 if(incoming?.schemaVersion!==1||!Array.isArray(incoming.metrics))return 'invalid';
 if(!current)return 'accept';const stamp=x=>Date.parse(x?.pipeline?.finishedAt||x?.checkedAt||''),a=stamp(current),b=stamp(incoming);
 if(!Number.isFinite(a))return 'accept';if(!Number.isFinite(b))return 'invalid';if(b<a)return 'older';
 if(b===a&&current.snapshotId&&incoming.snapshotId&&current.snapshotId!==incoming.snapshotId)return 'conflict';return 'accept';
}
export function acceptPacket(current,incoming){return packetDecision(current,incoming)==='accept';}
