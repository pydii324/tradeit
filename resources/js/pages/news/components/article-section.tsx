import dayjs from 'dayjs';
import { isMobile } from "react-device-detect";

interface Article {
    url: string;
    url_to_image: string;
    title: string;
    author: string;
    content: string;
    created_at: string;
}

interface ArticleProps {
    article: Article;
}

const ArticleSection = ({ article }: ArticleProps) => {
    return isMobile ? (
        <a href={article.url}>
            <div 
                className="flex flex-col gap-5 p-4 border w-full rounded-md shadow-sm cursor-pointer select-none"
            >
                {/* Mobile */}
                <div className="flex justify-center">
                    <div className="min-w-[380px] max-w-[380px] min-h-[150px] max-h-[200px] bg-gradient-to-r from-muted-foreground/20 to-foreground rounded-md overflow-hidden">
                        <img src={article.url_to_image} />
                    </div>
                </div>
                
                <div className="flex flex-col gap-4">
                    {/* 2 Extra Large 1536px */}
                    <div className="space-y-2.5">
                        <h2 className="text-2xl font-semibold">{article.title}</h2>
                        <h3 className="text-lg text-right text-foreground/80 font-semibold">- {article.author ?? 'N/A'}</h3>
                    </div>
                    <div
                        className="text-foreground flex-1"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    <div className="flex justify-end text-foreground/75">
                        Published: {dayjs(article.created_at).format('HH:mm - DD MMM YYYY')}
                    </div>
                </div>
            </div>
        </a>
    ) : (
        <a href={article.url}>
            <div 
                className="flex flex-col gap-2 p-4 border w-full rounded-md shadow-sm cursor-pointer select-none"
            >
                <div className="flex flex-row gap-4">
                    <div className="min-w-[240px] max-w-[240px] sm:min-w-[240px] sm:max-w-[240px] md:min-w-[280px] md:max-w-[280px] lg:min-w-[380px] lg:max-w-[380px]">
                        <div className="bg-gradient-to-r from-muted-foreground/20 to-foreground rounded-md min-h-[120px] overflow-hidden">
                            <img src={article.url_to_image} />    
                        </div>
                    </div>
                    <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">{article.title}</h2>
                </div>
                
                <div className="flex flex-col gap-2">
                    {/* 2 Extra Large 1536px */}
                    <div className="space-y-1">
                        <h3 className="text-lg sm:text-lg md:text-xl lg:text-xl text-foreground/90 font-semibold">{article.author}</h3>
                    </div>
                    <div
                        className="text-md sm:text-md md:text-lg lg:text-lg text-foreground flex-1"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                    <div className="flex justify-end text-foreground/75">
                        {dayjs(article.created_at).format('HH:mm - DD MMM YYYY')}
                    </div>
                </div>
            </div>
        </a>  
    );
};


export default ArticleSection;