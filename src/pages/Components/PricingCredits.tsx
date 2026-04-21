import React, { useState } from "react";
import "./pricing.css";
import { left } from "@popperjs/core";

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");

  return (
    <div className="page">

      {/* BACKGROUND */}
      <div className="bg-grid"></div>

      <div className="container text-center">

        {/* BADGE */}
        <div className="badge-top">
          <span className="dot"></span>
          DEVLABS · CREDITS PRICING
        </div>

        {/* TITLE */}
        <h1 className="title">
          Pay for what <br />
          <span className="grad">you actually use</span>
          <span className="stroke">nothing more.</span>
        </h1>

        {/* SUBTEXT */}
        <p className="sub">
          Credits align cost with consumption — light users pay less,
          power users scale seamlessly. Predictable margins, fair pricing.
        </p>

        {/* TOGGLE */}
        <div className="toggle-row">

          <div className="toggle">
            <button
              className={billing === "monthly" ? "active" : ""}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>

            <button
              className={billing === "yearly" ? "active" : ""}
              onClick={() => setBilling("yearly")}
            >
              Yearly
            </button>
          </div>

          <span className={`save-tag ${billing === "yearly" ? "show" : ""}`}>
            Save 33%
          </span>

        </div>

        {/* CREDIT BOX */}
        <div className="credit-box">

          <div className="credit-left">⚡</div>

          <div className="credit-content">
            <h4>How credits work</h4>

            <p>
              Every action in DevLabs consumes credits — starting a lab,
              extending sessions, or accessing premium clusters. Credits reset
              monthly with your plan, and you can top up anytime. Unused credits
              roll over for up to 3 months on paid plans.
            </p>

            <div className="credit-pills">
              <span>1 credit = <b>1 lab-hour (Linux/Docker)</b></span>
              <span>2 credits = <b>1 lab-hour (Kubernetes)</b></span>
              <span>3 credits = <b>1 lab-hour (RedHat Cluster)</b></span>
              <span>Unused credits roll over <b>up to 3 months</b></span>
            </div>
          </div>

        </div>

        <div className="container mt-5">
            <div className="row g-4">
                {/* FREE */}
                <div className="col-lg-3 col-md-6">
                    <div className="card-pro">
                        <span className="pill">STARTER</span>

                        <h3>Free</h3>
                        <p className="desc">Explore the basics with limited credits each month.</p>

                        <div className="credit-box">
                        20 cr <span>/ MONTH</span>
                        </div>

                        <h2>₹0</h2>
                        <p className="small">Forever free · no card needed</p>

                        <ul>
                        <li>✔ Linux + Docker (1 cr/hr)</li>
                        <li>✔ SSH access</li>
                        <li>✔ Community support</li>
                        <li className="mute">✖ No credit rollover</li>
                        </ul>

                        <button className="btn-outline">Start for free</button>
                    </div>
                </div>
                {/* PRO */}
                <div className="col-lg-3 col-md-6">
                    <div className="card-pro active">
                        <span className="pill purple-1">MOST POPULAR</span>
                        <span className="glow-dot"></span>

                        <h3>Pro</h3>
                        <p className="desc">For individuals building serious DevOps skills.</p>

                        <div className="credit-box purple-1">
                        100 cr <span>/ MONTH INCLUDED</span>
                        <div className="roll">↻ Rolls over up to 3 months</div>
                        </div>

                        <h2>₹499<span>/mo</span></h2>
                        <p className="small">Billed monthly · ₹5/credit</p>

                        <ul>
                        <li>✔ Everything in Free</li>
                        <li>✔ All lab types unlocked</li>
                        <li>✔ RedHat Cluster access (3 cr/hr)</li>
                        <li>✔ Guided lab environments</li>
                        <li>✔ Priority support</li>
                        <li>✔ Credit rollover · 3 months</li>
                        </ul>

                        <button className="btn-main">Get Pro</button>
                    </div>
                </div>
                {/* TEAM */}
                <div className="col-lg-3 col-md-6">
                    <div className="card-pro">
                        <span className="pill green-1">TEAM</span>

                        <h3>Team</h3>
                        <p className="desc">Shared credit pool for teams learning together.</p>

                        <div className="credit-box green-1">
                        500 cr <span>/ MONTH SHARED POOL</span>
                        <div className="roll">↻ Rolls over up to 3 months</div>
                        </div>

                        <h2>₹1,499<span>/mo</span></h2>
                        <p className="small">Up to 5 members · billed monthly</p>

                        <ul>
                        <li>✔ Everything in Pro</li>
                        <li>✔ Shared credit pool (5 seats)</li>
                        <li>✔ Team usage dashboard</li>
                        <li>✔ Shared lab environments</li>
                        <li>✔ Admin seat controls</li>
                        <li>✔ Dedicated support</li>
                        </ul>

                        <button className="btn-outline">Get Team</button>
                    </div>
                </div>
                {/* ENTERPRISE */}
                <div className="col-lg-3 col-md-6">
                    <div className="card-pro">
                        <span className="pill pink-1">ENTERPRISE</span>

                        <h3>Enterprise</h3>
                        <p className="desc">Custom credit bundles with full RedHat suite.</p>

                        <div className="credit-box pink-1">
                        Custom <span>VOLUME NEGOTIATED</span>
                        </div>

                        <h2>Custom</h2>
                        <p className="small">Volume discounts available</p>

                        <ul>
                        <li>✔ Everything in Team</li>
                        <li>✔ Enterprise RedHat cluster</li>
                        <li>✔ Unlimited seats</li>
                        <li>✔ SLA + dedicated infra</li>
                        <li>✔ Custom learning paths</li>
                        <li>✔ Premium 24/7 support</li>
                        </ul>

                        <button className="btn-outline">Contact sales</button>
                    </div>
                </div>
            </div>
        </div>
        <div className="container mt-5">
            <div className="section-label">
                TOP-UP CREDIT PACKS — NEVER RUN OUT MID-LAB
            </div>
            <div className="row g-4 mt-3">

                <div className="col-lg-3 col-md-6">
                <div className="top-card">
                    <h5>10 cr</h5>
                    <h3>₹99</h3>
                    <p>₹9.9 / credit</p>
                </div>
                </div>

                <div className="col-lg-3 col-md-6">
                <div className="top-card">
                    <h5>30 cr</h5>
                    <h3>₹249</h3>
                    <p>₹8.3 / credit</p>
                    <span className="bonus">+2 bonus credits</span>
                </div>
                </div>

                <div className="col-lg-3 col-md-6">
                <div className="top-card best-card">
                    <span className="best-tag">BEST VALUE</span>
                    <h5>100 cr</h5>
                    <h3>₹699</h3>
                    <p>₹6.9 / credit</p>
                    <span className="bonus">+10 bonus credits</span>
                </div>
                </div>

                <div className="col-lg-3 col-md-6">
                <div className="top-card">
                    <h5>250 cr</h5>
                    <h3>₹1,499</h3>
                    <p>₹6 / credit</p>
                    <span className="bonus">+30 bonus credits</span>
                </div>
                </div>

            </div>
        </div>
        {/* CREDIT COST TABLE */}
        <div className="credit-section">
            <p className="section-title-new">
                CREDIT COST PER LAB-HOUR
            </p>
            <div className="table-box">
                {/* HEADER */}
                <div className="table-row table-head">
                    <div>LAB ENVIRONMENT</div>
                    <div>CREDITS / HR</div>
                    <div className="table-head-right">
                    ≈ ₹ / HR (PRO PLAN)
                    </div>
                </div>

                {/* ROWS */}
                <div className="table-row">
                <div className="env">
                    <span className="dot yellow"></span> Linux
                </div>
                <div className="badge-1">1 cr</div>
                <div className="price">≈ ₹5</div>
                </div>

                <div className="table-row">
                <div className="env">
                    <span className="dot blue"></span> Docker
                </div>
                <div className="badge-1">1 cr</div>
                <div className="price">≈ ₹5</div>
                </div>

                <div className="table-row">
                <div className="env">
                    <span className="dot purple"></span> Terraform
                </div>
                <div className="badge-1">1 cr</div>
                <div className="price">≈ ₹5</div>
                </div>

                <div className="table-row">
                <div className="env">
                    <span className="dot green"></span> Kubernetes
                </div>
                <div className="badge-1">2 cr</div>
                <div className="price">≈ ₹10</div>
                </div>

                <div className="table-row">
                <div className="env">
                    <span className="dot pink"></span> RedHat Cluster
                </div>
                <div className="badge-1">3 cr</div>
                <div className="price">≈ ₹15</div>
                </div>

                <div className="table-row last">
                <div className="env">
                    <span className="dot orange"></span> RedHat Enterprise
                </div>
                <div className="badge-1">5 cr</div>
                <div className="price muted">Enterprise only</div>
                </div>

            </div>
        </div>
       
       <div className="campaign-wrapper">

  {/* HEADER */}
  <div className="campaign-title">
    📣 Campaign Ad Copy
  </div>

  {/* GRID */}
  <div className="campaign-grid">

    {/* LEFT CARD */}
    <div className="campaign-card">

      <p className="tag">SOCIAL · HOOK AD</p>

      <h3>
        Watching DevOps tutorials won't get you hired.
      </h3>

      <p className="desc">
        You need real hands-on experience.<br/>
        Practice Linux, Docker, Kubernetes & Red Hat in live lab environments —
        not just videos.<br/>
        Build skills that companies actually test for.
      </p>

      <button className="btn-soft">
        👉 Learn DevOps by Doing
      </button>
    </div>


    {/* RIGHT CARD */}
    <div className="campaign-card">

      <p className="tag">GOOGLE SEARCH · HIGH-CTR</p>

      <h4 className="heading">Headlines</h4>

      <div className="headline">Practice DevOps in Real Labs</div>
      <div className="headline">Learn Linux, Docker & Kubernetes Hands-On</div>
      <div className="headline">Stop Watching. Start Practicing DevOps</div>
      <div className="headline">No DevOps Experience? Start Here.</div>

      <p className="desc small">
        Gain real DevOps experience with hands-on labs. Practice Linux,
        Docker, Kubernetes & Red Hat in live environments.
      </p>

      <button className="btn-soft">
        👉 Start Your First Lab
      </button>
    </div>

  </div>
</div>
      </div>
      <div className="footer">
  
        <p>
            All plans include SSH access · guided environments · full lab support
        </p>

        <p>
            Credits never expire within 3 months · rollover on paid plans
        </p>

        <p className="contact">
            Questions? <span>Contact us</span>
        </p>

        </div>
    </div>
  );
}