import React from 'react';
import PropTypes from 'prop-types';
import PreviewMeta from './PreviewMeta';
import PreviewTags from './PreviewTags';
import AgendaLinks from './AgendaLinks';
import {isDisplayed, gettext, formatDate, formatTime} from 'utils';
import ListItemPreviousVersions from './ListItemPreviousVersions';
import ListItemNextVersion from './ListItemNextVersion';
import {
    getOtherMedia,
    showItemVersions,
    isKilled,
    DISPLAY_ABSTRACT,
    isPreformatted,
    getFeatureMedia,
    getGalleryMedia,
} from 'wire/utils';
import types from 'wire/types';
import Content from 'ui/components/Content';
import ContentHeader from 'ui/components/ContentHeader';
import ContentBar from 'ui/components/ContentBar';
import ArticleItemDetails from 'ui/components/ArticleItemDetails';
import ArticleContent from 'ui/components/ArticleContent';
import ArticleMedia from  'ui/components/ArticleMedia';
import ArticleContentWrapper from 'ui/components/ArticleContentWrapper';
import ArticleContentInfoWrapper from 'ui/components/ArticleContentInfoWrapper';
import ArticleHeadline from 'ui/components/ArticleHeadline';
import ArticleAbstract from 'ui/components/ArticleAbstract';
import {ArticleBodyHtml} from 'ui/components/ArticleBodyHtml';
import ArticleBody from 'ui/components/ArticleBody';
import ArticleAuthor from 'ui/components/ArticleAuthor';
import ArticleEmbargoed from 'ui/components/ArticleEmbargoed';
import PreviewEdnote from './PreviewEdnote';
import WireActionButtons from './WireActionButtons';
import {Authors} from './fields/Authors';
import {IArticle} from 'interfaces';
import MediaPreview from './MediaPreview';
interface IProps {
    item: IArticle;
    user: any;
    actions: any;
    topics: any;
    onClose: any;
    detailsConfig: any;
    downloadMedia: any;
    followStory: any;
    listConfig: any;
    filterGroupLabels: any;
}
function ItemDetails({
    item,
    user,
    actions,
    topics,
    onClose,
    detailsConfig,
    downloadMedia,
    followStory,
    listConfig,
    filterGroupLabels,
}: IProps) {
    const featureMedia = getFeatureMedia(item);
    const media = getOtherMedia(item);
    const itemType = isPreformatted(item) ? 'preformatted' : 'text';
    const galleryMedia = getGalleryMedia(item);
    return (
        <Content type="item-detail">
            <ContentHeader>
                <ContentBar onClose={onClose}>
                    <WireActionButtons
                        item={item}
                        user={user}
                        topics={topics}
                        actions={actions}
                        followStory={followStory}
                    />
                </ContentBar>
            </ContentHeader>
            <ArticleItemDetails disableTextSelection={detailsConfig.disable_text_selection}>
                <ArticleContent>
                    {featureMedia && (
                        <MediaPreview
                            media={featureMedia}
                            item={item}
                            download={downloadMedia}
                        />
                    )}
                    {galleryMedia && (
                        galleryMedia
                            .map((data) => (
                                <MediaPreview
                                    key={data?.guid}
                                    media={data}
                                    item={item}
                                    download={downloadMedia}
                                />
                            ))
                    )}
                    <ArticleContentWrapper itemType={itemType}>
                        <ArticleBody itemType={itemType}>
                            <ArticleEmbargoed item={item} />
                            <div className='wire-column__preview__date pb-2'>
                                {gettext('Published on {{ date }} at {{ time }}', {
                                    date: formatDate(item.versioncreated),
                                    time: formatTime(item.versioncreated),
                                })}
                            </div>
                            {isDisplayed('headline', detailsConfig) && <ArticleHeadline item={item}/>}
                            <ArticleAuthor item={item} displayConfig={detailsConfig} />
                            {isDisplayed('abstract', detailsConfig) &&
                            <ArticleAbstract item={item} displayAbstract={DISPLAY_ABSTRACT}/>}
                            {isDisplayed('body_html', detailsConfig) && <ArticleBodyHtml item={item}/>}
                            {media == null ? null : media.map((mediaItem) => (
                                <ArticleMedia
                                    key={mediaItem.guid}
                                    media={mediaItem}
                                    isKilled={isKilled(item)}
                                    download={downloadMedia}
                                />
                            ))}
                        </ArticleBody>

                        {isDisplayed('metadata_section', detailsConfig) && (
                            <PreviewMeta item={item} isItemDetail={true} displayConfig={detailsConfig}
                                listConfig={listConfig}
                                filterGroupLabels={filterGroupLabels}
                            />
                        )}
                        <ArticleContentInfoWrapper>
                            {isDisplayed('tags_section', detailsConfig) &&
                                <PreviewTags item={item} isItemDetail={true} displayConfig={detailsConfig}/>}

                            {isDisplayed('authors', detailsConfig) && (
                                <Authors item={item} />
                            )}

                            {isDisplayed('ednotes_section', detailsConfig) &&
                                <PreviewEdnote item={item} />}

                            {isDisplayed('item_versions', detailsConfig) && showItemVersions(item, true) &&
                                <ListItemNextVersion item={item} displayConfig={detailsConfig}  />
                            }
                            {isDisplayed('item_versions', detailsConfig) && showItemVersions(item) &&
                                <ListItemPreviousVersions item={item} displayConfig={detailsConfig} isPreview={true}/>
                            }

                            {isDisplayed('agenda_links', detailsConfig) && <AgendaLinks item={item} />}
                        </ArticleContentInfoWrapper>
                    </ArticleContentWrapper>
                </ArticleContent>
            </ArticleItemDetails>
        </Content>
    );
}

ItemDetails.propTypes = {
    item: types.item.isRequired,
    user: types.user.isRequired,
    topics: types.topics.isRequired,
    actions: types.actions,
    listConfig: PropTypes.object,
    detailsConfig: PropTypes.object,
    filterGroupLabels: PropTypes.object,

    onClose: PropTypes.func,
    downloadMedia: PropTypes.func,
    followStory: PropTypes.func,
};

export default ItemDetails;

