import React from "react";

// Prevent a runtime error inside one route from blanking the entire Utsav app.
export default class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.error(`Utsav ${this.props.routeName || "page"} route error:`, error);
  }
  render() {
    if (this.state.hasError) {
      return <main
        className="phase-page"
        style={{
          minHeight: "60vh",
          padding: "90px 24px"
        }}
      >
          <section style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 28,
        border: "1px solid #684653",
        borderRadius: 16,
        background: "#2a1a22"
      }}>
        <p style={{
          color: "#e6bd69",
          letterSpacing: ".15em",
          fontSize: 11,
          fontWeight: 700
        }}>UTSAV · PAGE ERROR</p>
        <h1 style={{
          fontSize: 32,
          margin: "12px 0"
        }}>This page couldn't load.</h1>
        <p style={{
          color: "#cbb9ad",
          lineHeight: 1.7
        }}>The rest of Utsav is still available. Try opening the calendar again, or return home.</p>
        <div style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 20
        }}>
          <button
            onClick={() => this.setState({ hasError: false })}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #e6bd69",
              background: "#e6bd69",
              color: "#25171c"
            }}
          >Try again</button>
          <a
            href="/"
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #684653",
              color: "#f6ebd7"
            }}
          >Go home</a>
        </div>
      </section>
        </main>;
    }
    return this.props.children;
  }
}
