(function(global, factory) {
  /* CommonJS */ if (typeof require === 'function' && typeof module === "object" && module && module["exports"])
      module['exports'] = (function() {
          return factory(require('bytebuffer'), require('pako'));
      })();
  /* Global */ else
      global["cbusPackage"] = factory(global.dcodeIO.ByteBuffer, global.pako);
})(this, function(ByteBuffer, pako) {
	var cbusPackage = function() {
		this.flag1 = cbusPackage.PACKAGE_START;
		this.flag2 = cbusPackage.PACKAGE_START;
		this.version = 1;
		this.type = cbusPackage.REQUEST;
		this.off = cbusPackage.SIZE_OF_HEAD;
		this.options = 0;
		this.codeinfo = 0;
		this.reserve1 = 0;
		this.serialNum = 0;
		this.bodysize = 0;
		this.srcaddr = 0;
		this.dstaddr = 0;
		this.command = 0;
		this.body = null;
		this.shortCode = 0;
	};

	cbusPackage.prototype.setSerialNumber = function(serialNum) {
		this.serialNum = serialNum;
	};

	cbusPackage.prototype.getSerialNumber = function() {
		return this.serialNum;
	};

	cbusPackage.prototype.setBody = function(body) {
		this.body = body;
	};

	cbusPackage.prototype.getBody = function() {
		return this.body;
	};

	cbusPackage.prototype.setCommand = function(command) {
		this.command = command;
	};

	cbusPackage.prototype.getCommand = function () {
		return this.command;
    };

	cbusPackage.prototype.getOffset = function() {
		return this.off;
	};

	cbusPackage.prototype.getBodySize = function() {
		return this.bodysize;
	};

	cbusPackage.prototype.setBodySize = function(bodysize) {
		this.bodysize = bodysize;
	};

	cbusPackage.prototype.getIsZip = function() {
		return (this.codeinfo & 0x1) === 1;
	};
	
	cbusPackage.prototype.getType = function() {
		return this.type;
	};

	cbusPackage.prototype.isPublishNewMsg = function() {
		if (this.options && (((this.options >> 7) & 1) === 1)) {
			return true
		}
		return false
	}

	cbusPackage.encodePackage = function(serialNum, command, body) {
		var pk = new cbusPackage();
		pk.setSerialNumber(serialNum);
		pk.setCommand(command);
    pk.setBody(body);
    pk.setBodySize(body.limit);

		var buffer = new ByteBuffer(cbusPackage.SIZE_OF_HEAD + pk.getBodySize());
		buffer.writeByte(pk.flag1);
		buffer.writeByte(pk.flag2);
		buffer.writeByte(pk.version);
		buffer.writeByte(pk.type);
		buffer.writeByte(pk.off);
		buffer.writeByte(pk.options);
		buffer.writeByte(pk.codeinfo);
		buffer.writeByte(pk.reserve1);
		buffer.writeInt(pk.serialNum);
		buffer.writeInt(pk.bodysize);
		buffer.writeInt(pk.srcaddr);
		buffer.writeInt(pk.dstaddr);
		buffer.writeInt(pk.command);
		buffer.writeInt16(pk.shortCode);
		if (pk.body != null) {
			for (var i = 0; i < pk.body.limit; i++) {
				buffer.writeByte(pk.body.readByte());
			}
		}
		buffer.offset = 0;
		return buffer;
	}

	cbusPackage.decodePackage1 = function(buffer) {
		var packages = [];
		while (buffer.remaining() > 0) {
			// read util 'P'
			if (!(buffer.readByte() === cbusPackage.PACKAGE_START && buffer.readByte() === cbusPackage.PACKAGE_START)) {
				continue;
			}
			var start = buffer.offset - 2;
			var headerBytes = buffer.copy(start, start + cbusPackage.SIZE_OF_HEAD);
			buffer.skip(cbusPackage.SIZE_OF_HEAD - 2);
			var header = cbusPackage.decodeHeader(headerBytes);
			packages.push(header);

			if (header.getOffset() - cbusPackage.SIZE_OF_HEAD > 0) {
				buffer.skip(header.getOffset() - cbusPackage.SIZE_OF_HEAD);
			}
			var bodySize = header.getBodySize();
			var bodyStart = buffer.offset;
			var bodyBytes = buffer.copy(bodyStart, bodyStart + bodySize);
			buffer.skip(bodySize);
			if(!header.getIsZip()) {
				header.body = bodyBytes;
			}else {
				header.body = ByteBuffer.wrap(pako.inflate(new Uint8Array(bodyBytes.toArrayBuffer())));
			}
		}
		return packages;
	};

    cbusPackage.decodePackageInternal = function (packages, buffer) {
    	var i = 0;
      while (buffer.remaining() > 0) {
        if(buffer.remaining < cbusPackage.SIZE_OF_HEAD) {
          break;
        }
			  // read util 'P'
        if (!(buffer.readByte() === cbusPackage.PACKAGE_START && buffer.readByte() === cbusPackage.PACKAGE_START)) {
          continue;
        }
        var start = buffer.offset - 2;
        var headerBytes = buffer.copy(start, start + cbusPackage.SIZE_OF_HEAD);
        buffer.skip(cbusPackage.SIZE_OF_HEAD - 2);
        var header = cbusPackage.decodeHeader(headerBytes);
        var offset  = header.getOffset() - cbusPackage.SIZE_OF_HEAD;
        if (offset > 0) {
          buffer.skip(offset);
        }
        var bodySize = header.getBodySize();
        var bodyStart = buffer.offset;
        var bodyBytes = buffer.copy(bodyStart, bodyStart + bodySize);
        if(buffer.remaining < bodySize) {
          break;
        }
        buffer.skip(bodySize);
        if(!header.getIsZip()) {
          header.body = bodyBytes;
        } else {
					header.body = ByteBuffer.wrap(pako.inflate(new Uint8Array(bodyBytes.toArrayBuffer())));
        }
        i += (cbusPackage.SIZE_OF_HEAD + offset + bodySize);
        packages.push(header);
      }
      return i;
    }

    cbusPackage.decodePackage = function(buffer) {
      var packages = [];
      if(buffer === undefined || buffer.remaining() === 0) {
        return packages;
      }
      if(recData !== undefined && recData.remaining() > 0) {
        var buffers = [buffer, recData];
        var newBuffer = ByteBuffer.concat(buffers);
        recData = newBuffer;
      } else {
        recData = buffer;
      }
      recData.mark();
      var i = this.decodePackageInternal(packages, recData);
      recData.reset();
      if(i > 0) {
        recData.skip(i);
      }
      return packages;
    };

	cbusPackage.decodeHeader = function(buffer) {
		var p = new cbusPackage();
		p.flag1 = buffer.readByte();
		p.flag2 = buffer.readByte();
		p.version = buffer.readByte();
		p.type = buffer.readByte();
		p.off = buffer.readByte();
		p.options = buffer.readByte();
		p.codeinfo = buffer.readByte();
		p.reserve1 = buffer.readByte();
		p.serialNum = buffer.readInt();
		p.bodysize = buffer.readInt();
		p.srcaddr = buffer.readInt();
		p.dstaddr = buffer.readInt();
		p.command = buffer.readInt();
		p.shortCode = buffer.readInt16();
		return p;
	};

	cbusPackage.PACKAGE_START = 80;
	cbusPackage.REQUEST = 1;
	cbusPackage.RESPONSE = 2;
	cbusPackage.Publish = 3;
	cbusPackage.SIZE_OF_HEAD = 0x1e;
	var recData = undefined;

	return cbusPackage;
});
