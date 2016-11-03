var ip = require('ip');
var permittedIps = process.env.IIGB_PERMITTED_IPS.split(' ');

exports.filter = function(req, res, next) {
    var clientIp = req.header('X-Forwarded-For');
    console.log(clientIp);
    try {

        var i;

        for (i = 0; i < permittedIps.length; i++) {
            if (ip.cidrSubnet(permittedIps[i]).contains(clientIp)) {
                next();
            }
        }
    } catch (err) {
        console.log(err);
    }
};
