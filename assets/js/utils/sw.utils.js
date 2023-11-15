const updateDynamicCache = (dynamicCache, req, res) =>{
    if(res.status === 200){
        return caches.open(dynamicCache).then((cache)=>{
            cache.put(req, res);
            return res;
        });
    }else{
        return res;
    }
}

const updateStaticCache = (staticCache, req, APP_SHELL_INMUTABLE) =>{
    if(APP_SHELL_INMUTABLE.includes(req.url)){
        //No hace falta actualizar
    }else{
        let response = null;
        try {
            response = axiosClient.get(req.url)
        } catch (error) {
            console.log(error);
        }
        return updateDynamicCache(staticCache, req, response);
    }
}

const apiSaveIncidence = (cacheName, req) =>{
    if(req.url.indexOf('/api/notification') >= 0 || req.url.indexOf('/api/notification/subscribe')){
        return axiosClient(req.url);
    }
    if(req.clone().method === 'POST'){
        if(self.registration.sync){
            return req.clone().text().then((body) =>{
                return saveIncidence(JSON.parse(body))
            })
        }
        return axiosClient.get(req.url);
    }else{
        return axiosClient.get(req.url).then((response) =>{
            if(response.status === 200){
                updateDynamicCache(cacheName, req, response)
            }else{
                return caches.match(req);
            }
        }).catch((err) =>{
            return caches.match(req);
        })
    }
}