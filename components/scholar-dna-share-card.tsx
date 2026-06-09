import {
  getShareCardInterestLabels,
  getShareCardKeywords,
  type ScholarDnaShareCardData,
} from "@/lib/scholar-dna-share-card";

type ScholarDnaShareCardProps = {
  data: ScholarDnaShareCardData;
  siteHost: string;
};

const CARD_WIDTH_PX = 540;

const chipStyle = {
  border: "1px solid #d9cbb7",
  backgroundColor: "rgba(239, 231, 216, 0.45)",
  borderRadius: 4,
  padding: "6px 11px",
  fontSize: 12,
  color: "#1d1a15",
  lineHeight: 1.4,
} as const;

export function ScholarDnaShareCard({ data, siteHost }: ScholarDnaShareCardProps) {
  const keywords = getShareCardKeywords(data.keywords);
  const interestLabels = getShareCardInterestLabels(data.scholarDna);
  const aiOneLiner = data.aiOneLiner.trim();

  return (
    <div
      className="text-keep"
      style={{
        width: CARD_WIDTH_PX,
        backgroundColor: "#f8f4ea",
        color: "#1d1a15",
        fontFamily:
          'var(--font-noto-sans-kr), "Noto Sans KR", ui-sans-serif, sans-serif',
        padding: "52px 44px 44px",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: 11,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#68462d",
        }}
      >
        AI가 읽은 학문 인생
      </p>

      <p
        style={{
          margin: "20px 0 0",
          fontSize: 14,
          lineHeight: 1.5,
          color: "#655d52",
        }}
      >
        {data.name} 교수
      </p>

      <p
        style={{
          margin: "28px 0 0",
          fontFamily:
            'var(--font-noto-serif-kr), "Noto Serif KR", Georgia, serif',
          fontSize: 38,
          lineHeight: 1.38,
          color: "#1d1a15",
          fontWeight: 600,
          letterSpacing: "-0.01em",
        }}
      >
        {data.scholarAlias}
      </p>

      {aiOneLiner ? (
        <p
          style={{
            margin: "28px 0 0",
            fontFamily:
              'var(--font-noto-serif-kr), "Noto Serif KR", Georgia, serif',
            fontSize: 16,
            lineHeight: 1.72,
            color: "#655d52",
          }}
        >
          {aiOneLiner}
        </p>
      ) : null}

      {keywords.length > 0 ? (
        <ul
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            margin: "32px 0 0",
            padding: 0,
            listStyle: "none",
          }}
        >
          {keywords.map((keyword) => (
            <li key={keyword} style={chipStyle}>
              {keyword}
            </li>
          ))}
        </ul>
      ) : null}

      {interestLabels.length > 0 ? (
        <div
          style={{
            marginTop: 32,
            paddingTop: 24,
            borderTop: "1px solid #d9cbb7",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#68462d",
            }}
          >
            Scholar DNA
          </p>

          <ul
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              margin: "14px 0 0",
              padding: 0,
              listStyle: "none",
            }}
          >
            {interestLabels.map((label) => (
              <li
                key={label}
                style={{
                  ...chipStyle,
                  backgroundColor: "rgba(239, 231, 216, 0.25)",
                  color: "#655d52",
                  fontSize: 11,
                }}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p
        style={{
          margin: "40px 0 0",
          paddingTop: 20,
          borderTop: "1px solid #d9cbb7",
          fontSize: 12,
          letterSpacing: "0.06em",
          color: "#655d52",
          textAlign: "center",
        }}
      >
        {siteHost}
      </p>
    </div>
  );
}
