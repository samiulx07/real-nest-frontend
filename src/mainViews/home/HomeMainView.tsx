import HomeBanner from '@/components/homeBanner/HomeBanner';
import { HOME_SEED_OBJ } from '@/shared/seeds/homeSeeds';

const HomeMainView = () => {
    return (
        <div>
            <HomeBanner slides={HOME_SEED_OBJ.bannerSlides} />
        </div>
    )
};

export default HomeMainView;
