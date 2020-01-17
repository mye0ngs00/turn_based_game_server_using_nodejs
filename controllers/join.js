/**
 * 참조하는 모듈: queue_manager.js
 */

exports = module.exports = (user1_socket, user2_socket)=>{
    let channel;
    (channel_pick = ()=>{
        channel = "test";
    })();

    user1_socket.channel = channel;
    user2_socket.channel = channel;
    user1_socket.join(channel);
    user2_socket.join(channel);
    console.log("join success.");
}