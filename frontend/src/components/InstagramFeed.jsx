import { useEffect, useState } from "react";

const InstagramFeed = () => {
  const [media, setMedia] = useState([]);
  const accessToken = localStorage.getItem("igAccessToken");

  useEffect(() => {
    if (accessToken) {
      fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink&access_token=${accessToken}`)
        .then(response => response.json())
        .then(data => {
          console.log("Instagram Media:", data);
          setMedia(data.data || []);
        })
        .catch(error => console.error("Error fetching Instagram media:", error));
    }
  }, [accessToken]);

  return (
    <div>
      <h2>Instagram Feed</h2>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {media.length > 0 ? (
          media.map((item) => (
            <div key={item.id} style={{ margin: "10px" }}>
              {item.media_type === "IMAGE" && (
                <img src={item.media_url} alt={item.caption} width="200" />
              )}
              {item.media_type === "VIDEO" && (
                <video controls width="200">
                  <source src={item.media_url} type="video/mp4" />
                </video>
              )}
              <p>{item.caption}</p>
              <a href={item.permalink} target="_blank" rel="noopener noreferrer">View on Instagram</a>
            </div>
          ))
        ) : (
          <p>No media available.</p>
        )}
      </div>
    </div>
  );
};

export default InstagramFeed;
