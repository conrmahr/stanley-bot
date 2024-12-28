import { DraftOptions, OfficialOptions } from '../types';
import { getQueryExpression } from '../utils/helpers.js';

export const getDraft = async (args: DraftOptions) => {
  try {
    const build = [];
    if (args.draftYear) build.push(`draftYear=${args.draftYear}`);
    if (args.draftedByTeamId) build.push(`draftedByTeamId=${args.draftedByTeamId}`);
    const query = getQueryExpression(build);

    const response = await fetch(`https://records.nhl.com/site/api/draft/?${query}`);

    if (!response.ok) {
      console.error(`Failed to fetch draft: ${response.status}`);
      return;
    }

    const { data }: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch draft');
    console.error(error);
  }
};
export const getOfficials = async (args: OfficialOptions) => {
  try {
    const build = [];
    if (args.id) build.push(`id=${args.id}`);
    if (args.active) build.push(`active=${args.active}`);
    const query = getQueryExpression(build);

    const response = await fetch(`https://records.nhl.com/site/api/officials?${query}`);

    if (!response.ok) {
      console.error(`Failed to fetch officials: ${response.status}`);
      return;
    }

    const { data }: any = await response.json();

    return data;
  } catch (error) {
    console.error('Failed to fetch officials');
    console.error(error);
  }
};
