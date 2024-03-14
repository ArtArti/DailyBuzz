import React,{useEffect, useState} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import PropTypes from "prop-types";
import Spinner from './Spinner';
import NewsItem from './NewsItem';
function News(props) {
    const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - DailyBuzz`;
    updateNews();
  }, []);

  const fetchMoreData = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apiKey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setPage(page + 1);
    let data = await fetch(url);
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
  };
  return (
    <>
      <h1 className=" text-centre mx-12 my-8 font-bold text-5xl">
        Navigate the Noise: Let <span>DailyBuzz</span> Guide You to the Stories
        That Matter
      </h1>
      <h2
        className="text-center text-4xl font-bold"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        DailyBuzz - Top {capitalizeFirstLetter(props.category)} Headlines
      </h2>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles ? articles.length : 0} 
        next={fetchMoreData}
        hasMore={articles ? articles.length !== totalResults : false}
        loader={<Spinner />}
      >
       <div className="w-full lg:flex justify-center items-center">
            <div className="container flex flex-wrap justify-center">
            {articles &&
              articles.map((element) => {
                return (
                  <div className="card-container" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                      source={element.source.name}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </InfiniteScroll>
    </>
  )
}

News.defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  
  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };
  

export default News
