import { Subnet } from "../context/NetworkContext";

// Convert IP address to binary
const ipToBinary = (ip: string): string => {
  return ip
    .split(".")
    .map((octet) => parseInt(octet, 10).toString(2).padStart(8, "0"))
    .join("");
};

// Convert binary to IP address
const binaryToIp = (binary: string): string => {
  const octets = [];
  for (let i = 0; i < 32; i += 8) {
    octets.push(parseInt(binary.substr(i, 8), 2));
  }
  return octets.join(".");
};

// Find required Subnet bits based on hosts
const getRequiredSubnetBits = (hosts: number): number => {
  // Hosts + 2 (network and broadcast addresses)
  return Math.ceil(Math.log2(hosts + 2));
};

// Calcular Subnet details
export const CalcularSubnets = (
  baseNetwork: string,
  SubnetMask: number,
  Subnets: Subnet[]
): Subnet[] => {
  // Sort Subnets by required hosts (descending)
  const sortedSubnets = [...Subnets].sort((a, b) => b.hosts - a.hosts);

  // Calcular available bits for Subnetting
  const availableBits = 32 - SubnetMask;

  // Convert base network to binary
  let networkBinary = ipToBinary(baseNetwork);
  // Ensure network bits are correct (set host bits to 0)
  networkBinary =
    networkBinary.substring(0, SubnetMask) + "0".repeat(availableBits);

  let currentNetworkBits = networkBinary;
  const CalculardSubnets: Subnet[] = [];

  for (const Subnet of sortedSubnets) {
    const requiredHostBits = getRequiredSubnetBits(Subnet.hosts);
    const newSubnetMask = 32 - requiredHostBits;

    if (newSubnetMask < SubnetMask) {
      throw new Error("Base network is too small for the required Subnets");
    }

    // Get Subnet bits
    const SubnetBits = currentNetworkBits.substring(0, newSubnetMask);
    const totalHosts = Math.pow(2, 32 - newSubnetMask);
    const usableHosts = totalHosts - 2;

    // Calcular addresses
    const networkAddress = binaryToIp(
      SubnetBits + "0".repeat(32 - newSubnetMask)
    );
    const broadcastBinary = SubnetBits + "1".repeat(32 - newSubnetMask);
    const broadcastAddress = binaryToIp(broadcastBinary);

    // First usable address (network address + 1)
    const firstUsableBinary =
      SubnetBits + "0".repeat(32 - newSubnetMask - 1) + "1";
    const firstUsableAddress = binaryToIp(firstUsableBinary);

    // Last usable address (broadcast address - 1)
    const lastUsableBinary =
      SubnetBits + "1".repeat(32 - newSubnetMask - 1) + "0";
    const lastUsableAddress = binaryToIp(lastUsableBinary);

    CalculardSubnets.push({
      ...Subnet,
      networkAddress,
      SubnetMask: `/${newSubnetMask}`,
      broadcastAddress,
      firstUsableAddress,
      lastUsableAddress,
      totalHosts,
      usableHosts,
    });

    // Move to the next network address
    const nextNetworkBinary = incrementBinary(broadcastBinary);
    currentNetworkBits = nextNetworkBinary;
  }

  return CalculardSubnets;
};

// Helper to increment binary IP
const incrementBinary = (binary: string): string => {
  const decimal = parseInt(binary, 2) + 1;
  return decimal.toString(2).padStart(32, "0");
};

// Format IP with CIDR notation
export const formatCIDR = (ip: string, mask: string): string => {
  return `${ip}/${mask}`;
};

// Convert CIDR mask to dotted decimal
export const cidrToSubnetMask = (cidr: number): string => {
  const bits = "1".repeat(cidr) + "0".repeat(32 - cidr);
  return binaryToIp(bits);
};

// Validate IP address format
export const isValidIpAddress = (ip: string): boolean => {
  const pattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  if (!pattern.test(ip)) return false;

  const octets = ip.split(".");
  for (const octet of octets) {
    const num = parseInt(octet, 10);
    if (num < 0 || num > 255) return false;
  }

  return true;
};

// Validate Subnet mask format
export const isValidSubnetMask = (mask: string): boolean => {
  const num = parseInt(mask, 10);
  return !isNaN(num) && num >= 0 && num <= 32;
};
