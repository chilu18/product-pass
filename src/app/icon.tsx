import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ecfdf5",
          borderRadius: 7,
        }}
      >
        <div
          style={{
            position: "relative",
            width: 22,
            height: 28,
            borderRadius: 4,
            background: "#059669",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: 5,
              height: "100%",
              background: "#047857",
            }}
          />
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 4C8 4 5 7.5 5 12c0 5.5 4.5 9.5 7 11 2.5-1.5 7-5.5 7-11 0-4.5-3-8-7-8zm0 3c2.2 0 4 1.8 4 4 0 2.5-2 4.5-4 5.5-2-1-4-3-4-5.5 0-2.2 1.8-4 4-4z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    ),
    { ...size }
  );
}
