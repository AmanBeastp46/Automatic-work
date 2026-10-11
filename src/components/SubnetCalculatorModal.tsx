import React, { useState } from 'react';
import { 
  Calculator, 
  X, 
  Copy, 
  Check, 
  Terminal, 
  CheckCircle2, 
  Sparkles,
  Layers
} from 'lucide-react';

interface SubnetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubnetCalculatorModal: React.FC<SubnetCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [ipInput, setIpInput] = useState('192.168.10.75');
  const [prefixInput, setPrefixInput] = useState(26);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Compute subnet values
  const calculateSubnet = (ipStr: string, prefix: number) => {
    try {
      const parts = ipStr.trim().split('.').map(p => parseInt(p, 10));
      if (parts.length !== 4 || parts.some(p => isNaN(p) || p < 0 || p > 255)) {
        return null;
      }

      // Convert to 32-bit int
      const ip32 = ((parts[0] << 24) >>> 0) + ((parts[1] << 16) >>> 0) + ((parts[2] << 8) >>> 0) + (parts[3] >>> 0);
      
      const mask32 = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
      const net32 = (ip32 & mask32) >>> 0;
      const wild32 = (~mask32) >>> 0;
      const bcast32 = (net32 | wild32) >>> 0;

      const numHosts = prefix >= 31 ? (prefix === 31 ? 2 : 1) : Math.pow(2, 32 - prefix) - 2;

      const intToIp = (num: number) => [
        (num >>> 24) & 255,
        (num >>> 16) & 255,
        (num >>> 8) & 255,
        num & 255
      ].join('.');

      // Magic number block size
      const interestingOctetIndex = Math.floor((prefix - 1) / 8);
      const maskOctets = intToIp(mask32).split('.').map(Number);
      const magicNumber = 256 - maskOctets[interestingOctetIndex];

      return {
        ip: ipStr,
        prefix,
        subnetMask: intToIp(mask32),
        wildcardMask: intToIp(wild32),
        networkAddress: intToIp(net32),
        broadcastAddress: intToIp(bcast32),
        firstUsable: prefix >= 31 ? intToIp(net32) : intToIp(net32 + 1),
        lastUsable: prefix >= 31 ? intToIp(bcast32) : intToIp(bcast32 - 1),
        usableHosts: numHosts > 0 ? numHosts : 0,
        magicNumber,
        interestingOctet: interestingOctetIndex + 1
      };
    } catch {
      return null;
    }
  };

  const result = calculateSubnet(ipInput, prefixInput);

  const copyResult = () => {
    if (!result) return;
    const text = `Cisco NetAcad Subnet Calculation:
IP: ${result.ip}/${result.prefix}
Subnet Mask: ${result.subnetMask}
Wildcard Mask (ACL/OSPF): ${result.wildcardMask}
Network Address: ${result.networkAddress}
First Usable Host: ${result.firstUsable}
Last Usable Host: ${result.lastUsable}
Broadcast Address: ${result.broadcastAddress}
Magic Number (Block Size): ${result.magicNumber}
Usable Hosts: ${result.usableHosts}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-2xl cyber-panel border border-cyan-500/40 p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto cyber-glow-cyan">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-purple-950/60 hover:bg-purple-900 text-purple-300 hover:text-white border border-purple-500/30"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-500 cyber-cut-sm">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold text-white tracking-wide">
              Cisco NetAcad CIDR Subnet Calculator
            </h2>
            <p className="text-xs text-cyan-300 font-mono">
              Magic Number Method • Usable Hosts • Wildcard Masks for ACLs
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#090314] border border-purple-500/25">
          <div className="sm:col-span-2 space-y-1.5">
            <label className="text-xs font-mono text-purple-300">IPv4 Address:</label>
            <input
              type="text"
              value={ipInput}
              onChange={(e) => setIpInput(e.target.value)}
              placeholder="192.168.1.1"
              className="w-full bg-[#110626] border border-purple-500/30 rounded px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-purple-300">Prefix (/CIDR):</label>
            <select
              value={prefixInput}
              onChange={(e) => setPrefixInput(Number(e.target.value))}
              className="w-full bg-[#110626] border border-purple-500/30 rounded px-3 py-2 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-400"
            >
              {Array.from({ length: 31 }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>/{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result Table */}
        {result ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-purple-300 font-bold">Subnet Matrix:</span>
              <button
                onClick={copyResult}
                className="px-2.5 py-1 rounded bg-purple-950 text-xs font-mono text-cyan-300 border border-purple-500/30 flex items-center gap-1 hover:bg-purple-900"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-cyan-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Values'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0b0416] border border-purple-500/20">
                <span className="text-purple-400 text-[10px]">Network ID:</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{result.networkAddress}</div>
              </div>

              <div className="p-2.5 rounded bg-[#0b0416] border border-purple-500/20">
                <span className="text-purple-400 text-[10px]">Broadcast Address:</span>
                <div className="text-sm font-bold text-pink-300 mt-0.5">{result.broadcastAddress}</div>
              </div>

              <div className="p-2.5 rounded bg-[#0b0416] border border-purple-500/20">
                <span className="text-purple-400 text-[10px]">First Usable Host:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{result.firstUsable}</div>
              </div>

              <div className="p-2.5 rounded bg-[#0b0416] border border-purple-500/20">
                <span className="text-purple-400 text-[10px]">Last Usable Host:</span>
                <div className="text-sm font-bold text-slate-100 mt-0.5">{result.lastUsable}</div>
              </div>

              <div className="p-2.5 rounded bg-[#0b0416] border border-purple-500/20">
                <span className="text-purple-400 text-[10px]">Subnet Mask:</span>
                <div className="text-sm font-bold text-slate-200 mt-0.5">{result.subnetMask}</div>
              </div>

              <div className="p-2.5 rounded bg-[#0b0416] border border-purple-500/20">
                <span className="text-purple-400 text-[10px]">Wildcard Mask (ACL/OSPF):</span>
                <div className="text-sm font-bold text-slate-200 mt-0.5">{result.wildcardMask}</div>
              </div>

              <div className="p-2.5 rounded bg-[#0e0621] border border-cyan-500/30">
                <span className="text-cyan-400 text-[10px]">Magic Number (Block Size):</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{result.magicNumber} (Octet {result.interestingOctet})</div>
              </div>

              <div className="p-2.5 rounded bg-[#0e0621] border border-cyan-500/30">
                <span className="text-cyan-400 text-[10px]">Total Usable Hosts:</span>
                <div className="text-sm font-bold text-cyan-300 mt-0.5">{result.usableHosts}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded bg-pink-950/40 text-pink-300 text-xs font-mono">
            Please enter a valid IPv4 address (e.g. 192.168.1.10).
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-heading font-semibold text-xs tracking-wider"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
