import axios from "axios";
import React from "react";

function CardDetail({
  detail,
  updateSplit,
  toggleCardDetail,
  handleExpenseDelete,
}) {
  let getBorder = detail.category == "income" ? " border-green" : " border-red";

  return (
    <div className="card-detail-container">
      <div className="card-detail-card">
        <div className="card-detail-nav-bar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => {
              handleExpenseDelete(detail);
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            onClick={() => {
              toggleCardDetail({});
            }}
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        <div className={`${getBorder} card-detail-titlebar`}>
          <div class="card-detail-title">{detail.category}</div>
          <div class="card-detail-expense">₹ {detail.expense}</div>
        </div>
        <div className={`card-detail-date-row ${getBorder}`}>
          <div>
            {new Date(detail.at).toLocaleString("en-IN", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </div>
          {new Date(detail.at).toLocaleString("en-IN", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })}
        </div>
        {detail.split[0] ? (
          <div className={`card-detail-splits ${getBorder}`}>
            {detail.split.map((splt, index) => (
              <div
                className={
                  splt.paid
                    ? "split-strikethrough split-detail"
                    : "split-detail"
                }
                onClick={() => {
                  updateSplit(detail, index);
                }}
              >
                <div>{splt.name}</div>
                <div className="split-value">
                  ₹ {detail.expense / detail.split.length}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
        <div className="card-detail-tags">
          <div class="card-detail-tag tag-color-primary">{detail.type}</div>
          {detail.split.length > 1 && (
            <div class="card-detail-tag tag-color-split">
              Split x{detail.split.length}
            </div>
          )}
          <div class="card-detail-tag tag-color-date">
            {new Date(detail.at).toLocaleString("en-IN", {
              weekday: "short",
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetail;
