import type React from "react";
import { useProviderSelector } from "@/store/provider";
import "./configurations.styles.scss";

export const Configurations: React.FC = () => {
  const { configuration, setConfiguration } = useProviderSelector(
    "configuration",
    "setConfiguration",
  );

  console.log(configuration);

  return (
    <div className="rootConfigurations">
      <button onClick={() => setConfiguration && setConfiguration()}>
        Close
      </button>
    </div>
  );
};
