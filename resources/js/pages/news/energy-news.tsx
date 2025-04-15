import NewsPage from './news-page';

export default function EnergyNews() {
    return (
        <NewsPage
            title="Energy"
            apiEndpoint="/news/energy"
            category="Energy"
        />
    )
}