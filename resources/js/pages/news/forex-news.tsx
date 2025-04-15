import NewsPage from './news-page';

export default function ForexNews() {
    return (
        <NewsPage
            title="Forex"
            apiEndpoint="/news/forex"
            category="forex"
        />
    )
}