/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  branches: [
    'main',
    { name: 'next', channel: 'next', prerelease: true },
  ],
  tagFormat: "${name}-v${version}",
  plugins: [
    [
      '@semantic-release/commit-analyzer',
      {
        preset: 'angular',
        releaseRules: [
          {
            breaking: true,
            release: 'major',
          },
          {
            type: 'feat',
            release: 'minor',
          },
          {
            type: 'fix',
            release: 'patch',
          },
          {
            type: 'docs',
            scope: 'README',
            release: 'patch',
          },
        ],
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/release-notes-generator',
      {
        preset: 'conventionalcommits',
        presetConfig: {
          types: [
            {type: 'feat', section: 'Features', hidden: false},
            {type: 'fix', section: 'Bug Fixes', hidden: false},
            {type: 'docs', section: 'Miscellaneous Chores', hidden: false},
            {type: 'chore', section: 'Miscellaneous Chores', hidden: false},
          ],
        },
        parserOpts: {
          noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES', 'BREAKING'],
        },
      },
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
      },
    ],
    ['@semantic-release/npm',
      {
        'npmPublish': true,
        'pkgRoot': '.',
      }
    ],
    [
      '@semantic-release/git',
      {
        assets: ['package.json', 'CHANGELOG.md'],
        message: "chore(release): ${nextRelease.version} \n\n${nextRelease.notes}",
      },
    ],
    '@semantic-release/gitlab',
  ],
}
