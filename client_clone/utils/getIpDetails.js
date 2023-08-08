import { getThingsToDo } from "@/apollo/services";
import  { NextRequest } from 'next/server'

export async function getIpAddress() {
  const IP2KEY = process.env.IP2KEY
  if (!IP2KEY) return false;

  // let resp = await fetch("https://api-ipv6.ip.sb/ip");
  // if (!ip?.ip) return false;

  return { latitude: 12.86667, longitude: 74.88333 };
  const url = `https://api.ip2location.io/?key=${IP2KEY}&ip=${ip.ip}`;
  let details = await fetch(url);
  details = await details.json();
  if (details?.latitude)
    return { latitude: details.latitude, longitude: details.longitude };
  return false;
}

//get the IP addresses associated with an account
function getIPs(callback) {
  var ip_dups = {};

  //compatibility for firefox and chrome
  var RTCPeerConnection =
    window.RTCPeerConnection ||
    window.mozRTCPeerConnection ||
    window.webkitRTCPeerConnection;
  var useWebKit = !!window.webkitRTCPeerConnection;

  //bypass naive webrtc blocking using an iframe
  if (!RTCPeerConnection) {
    var win = iframe.contentWindow;
    RTCPeerConnection =
      win.RTCPeerConnection ||
      win.mozRTCPeerConnection ||
      win.webkitRTCPeerConnection;
    useWebKit = !!win.webkitRTCPeerConnection;
  }

  //minimal requirements for data connection
  var mediaConstraints = {
    optional: [{ RtpDataChannels: true }],
  };

  var servers = { iceServers: [{ urls: "stun:stun.services.mozilla.com" }] };

  //construct a new RTCPeerConnection
  var pc = new RTCPeerConnection(servers, mediaConstraints);

  function handleCandidate(candidate) {
    //match just the IP address
    var ip_regex =
      /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
    var ip_addr = ip_regex.exec(candidate)[1];

    //remove duplicates
    if (ip_dups[ip_addr] === undefined) callback(ip_addr);

    ip_dups[ip_addr] = true;
  }

  //listen for candidate events
  pc.onicecandidate = function (ice) {
    //skip non-candidate events
    if (ice.candidate) handleCandidate(ice.candidate.candidate);
  };

  //create a bogus data channel
  pc.createDataChannel("");

  //create an offer sdp
  pc.createOffer(
    function (result) {
      //trigger the stun server request
      pc.setLocalDescription(
        result,
        function () {},
        function () {}
      );
    },
    function () {}
  );

  //wait for a while to let everything done
  setTimeout(function () {
    //read candidate info from local description
    var lines = pc.localDescription.sdp.split("\n");

    lines.forEach(function (line) {
      if (line.indexOf("a=candidate:") === 0) handleCandidate(line);
    });
  }, 1000);
}
