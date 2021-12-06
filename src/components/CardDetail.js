import React from "react";

function CardDetail({ detail, updateSplit }) {
  let getBorder = detail.category == "income" ? " border-green" : " border-red";
  return (
    <div className="card-detail-container">
      <div className="card-detail-card">
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