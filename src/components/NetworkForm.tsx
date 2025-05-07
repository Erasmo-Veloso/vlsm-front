import React from "react";
import { useNetwork } from "../context/NetworkContext";
import { isValidIpAddress, isValidSubnetMask } from "../utils/vlsmCalculator";
import { Calculator } from "lucide-react";

const NetworkForm: React.FC = () => {
  const {
    baseNetwork,
    SubnetMask,
    setBaseNetwork,
    setSubnetMask,
    CalcularVLSM,
  } = useNetwork();

  const [errors, setErrors] = React.useState({
    network: "",
    mask: "",
  });

  const handleNetworkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBaseNetwork(value);

    if (!isValidIpAddress(value)) {
      setErrors((prev) => ({
        ...prev,
        network: "Por favor, Coloque um IP válido! ex.: 192.168.1.0",
      }));
    } else {
      setErrors((prev) => ({ ...prev, network: "" }));
    }
  };

  const handleMaskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSubnetMask(value);

    if (!isValidSubnetMask(value)) {
      setErrors((prev) => ({ ...prev, mask: "Coloque um CIDR (0-32) válido" }));
    } else {
      setErrors((prev) => ({ ...prev, mask: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs
    if (!isValidIpAddress(baseNetwork)) {
      setErrors((prev) => ({
        ...prev,
        network: "Por favor, Coloque um IP válido! ex.: 192.168.1.0",
      }));
      return;
    }

    if (!isValidSubnetMask(SubnetMask)) {
      setErrors((prev) => ({ ...prev, mask: "Coloque um CIDR (0-32) válido" }));
      return;
    }

    // Calcular VLSM
    CalcularVLSM();
  };

  return (
    <div className="card">
      <div className="flex items-center space-x-2 mb-4">
        <Calculator size={20} className="text-blue-600" />
        <h2 className="text-xl font-semibold">Configurações de rede</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="baseNetwork"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Endereço de rede base
          </label>
          <input
            id="baseNetwork"
            type="text"
            value={baseNetwork}
            onChange={handleNetworkChange}
            placeholder="e.g. 192.168.0.0"
            className="form-input"
          />
          {errors.network && (
            <p className="mt-1 text-sm text-red-600">{errors.network}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="SubnetMask"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Máscara (CIDR)
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              /
            </span>
            <input
              id="SubnetMask"
              type="text"
              value={SubnetMask}
              onChange={handleMaskChange}
              placeholder="e.g. 24"
              className="form-input rounded-l-none"
            />
          </div>
          {errors.mask && (
            <p className="mt-1 text-sm text-red-600">{errors.mask}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center space-x-2"
          disabled={!!errors.network || !!errors.mask}
        >
          <Calculator size={16} />
          <span>Calcular VLSM</span>
        </button>
      </form>
    </div>
  );
};

export default NetworkForm;
