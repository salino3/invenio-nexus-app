type AdvertisementProps = {
  dev?: boolean;
  width: string;
  height: string;
};

export default function Advertisement({
  dev = true,
  width,
  height,
}: AdvertisementProps) {
  if (dev) {
    return (
      <div
        style={{
          width: width,
          height: height,
          border: "1px solid #444",
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2d2d2d",
          color: "#bbb",
          fontSize: 18,
          textAlign: "center",
        }}
      >
        Google Ad (${width} * ${height})
      </div>
    );
  }

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client="ca-xxxxxxxxxxxxxxx"
      data-ad-slot="123xxxxxxxxx"
      data-ad-format="auto"
    />
  );
}
