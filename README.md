# ha-camera-card
Startup setup for new lovelace (Home Assistant) card development

Startet from project  
`git clone https://github.com/maxwroc/lovelace-card-boilerplate.git your-card-name`


## How to use it?

1. Get the template code

    * Click on the "Use this template" button at the top of this page. Your private repo will be created for you.

    * Clone your repo to your box
    
    OR
    
    * Clone this repo to your box
      
      `git clone https://github.com/bimberle/ha-camera-card.git your-card-name`

    * Create empty repo on your git server and copy it's url

    * Change the remote url

      `git remote set-url origin [your target repo url]`

2. Change the card class name and the custom element name in index.ts, update package.json

3. Push the code and you are ready to go

    `git push origin master`

4. Edit Copy targets
   The build will automatically copy the relevant files to your homeassistant config directory. Edit targets to your needs:
   ```
   targets: [
      { src: 'src/*', dest: '/Volumes/dockerfiles/configs/hass-config/www/custom_ui/src' },
      { src: 'dist/*', dest: '/Volumes/dockerfiles/configs/hass-config/www/custom_ui/dist' }
    ]
    ```
   
6. Build

    Run `npm install` once before first build.

   * `npm run build` produces debug version of the code (just bundled but no crunched)
   * `npm run release` produces crunched bundle

    The output files are located in `dist` directory.

    Note: The style.ts file is auto-generated
    
7. Add Card to your configuration 
   ```yaml
     - url: /local/custom_ui/dist/my-custom-card.js
       type: module
   ```
 
    

